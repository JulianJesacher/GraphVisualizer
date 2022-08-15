import { Injectable } from "@angular/core";

interface State {
    something: string;
}


const empty = (): GraphAlgorithm => {
    return {
        done: true,
        value: {
            something: 'empty'
        }
    };
}


export class CountingAlgorithm {
    private counter: number = 0;

    step() {
        this.counter++;
        return this.counter;
    }
}

type GraphAlgorithm = (payload: any) => Iterator<State, State>;


@Injectable({
    providedIn: 'root'
})
export class AlgorithmService {

    private stateHistory: State[];
    private algorithm?: GraphAlgorithm;

    setAlgorithm(algorithm: GraphAlgorithm) {
        this.clear();
        this.algorithm = algorithm;
    }

    start(payload: any) {
        this.algorithm(payload);
    }

    clear() {

    }

    stepForward() {
        // Iterator next oder weiter Function call
    }

    stepBackward() {
        // History eins zurück
    }
}


const  algorithmService = new AlgorithmService();
const countingAlgo = new CountingAlgorithm();
algorithmService.setAlgorithm(countingAlgo.step);