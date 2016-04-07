/*
 * Copyright 2015 Alexander Pustovalov
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { fork, take, call, put, cancel } from 'redux-saga/effects';
import { SagaCancellationException } from 'redux-saga';
import { serverApi, graphApi, utils } from '../../../api';
import * as actions from './actions.js';
import * as spinnerActions from '../../app/AppSpinner/actions.js';
import * as messageActions from '../../app/AppMessage/actions.js';
import { pushHistory } from '../HistoryControls/actions.js';

function* preserveModel(){
    while(true){
        yield take(actions.SAVE_MODEL);
        const model = graphApi.getModel();
        yield fork(serverApi.saveProjectModel, model);
    }
}

const delay = ms => new Promise(resolve => setTimeout(() => resolve('timed out'), ms));

function* delayForCompiler(){
    try{
        yield call(delay, 20000);
        yield put(messageActions.timeout('The source code compiling is timed out. Look at console output or reload the browser page.'));
        yield put(actions.setReloadPageRequest());
        yield put(actions.compilerTimeout());
    } catch(e) {
        if (e instanceof SagaCancellationException) {
            // do nothing
        }
    }
}

function* waitForCompiler(){
    while(true){
        yield take(actions.COMPILER_START);
        yield put(spinnerActions.started('Compiling the source code'));
        const delayTask = yield fork(delayForCompiler);
        yield take([actions.COMPILER_DONE, actions.COMPILER_TIMEOUT]);
        yield cancel(delayTask);
        yield put(spinnerActions.done('Compiling the source code'));
    }
}

function* delayForPageLoaded(){
    try{
        yield call(delay, 30000);
        yield put(messageActions.timeout('Page loading is timed out. Look at the console output and try to fix error. ' +
            'Page will be reloaded automatically after successful compiling.'));
        yield put(actions.setReloadPageRequest());
        yield put(actions.pageLoadTimeout());
    } catch(e){
        if (e instanceof SagaCancellationException) {
            // do nothing
        }
    }
}

function* waitForPageLoaded(){
    while(true){
        yield take([actions.LOAD_PAGE, actions.RELOAD_PAGE]);
        yield put(spinnerActions.started('Loading page'));
        const delayTask = yield fork(delayForPageLoaded);
        yield take([actions.PAGE_LOADED, actions.PAGE_LOAD_TIMEOUT]);
        yield cancel(delayTask);
        yield put(spinnerActions.done('Loading page'));
    }
}

// main saga
export default function* mainSaga() {
    yield [
        fork(waitForPageLoaded),
        fork(waitForCompiler),
        fork(preserveModel)
    ];
};
