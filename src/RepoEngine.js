/**
 *  Copyright (c) 2017, Applitopia, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the MIT-style license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 *  @flow
 */

import { List, fromJS } from 'immutable-sorted';
import StateEngine from './StateEngine';

const cast = <T>(value: any): T => (value: T);

export default class RepoEngine extends StateEngine implements EngineInterface {

  constructor(schema: Schema) {
    super(schema);
  }

  repoReducer(): RepoReducer {
    const stateReducer: StateReducer = super.stateReducer();

    const repoOptionsProps: RepoOptionsProps = {
      history: 1000,
    };

    const repoBranchProps: RepoBranchProps = {
      currentIndex: -1,
      live: true,
      states: [],
      actions: [],
    };

    const repoProps: RepoProps = {
      version: 0,
      options: repoOptionsProps,
      currentBranch: 'master',
      branches: {'master': repoBranchProps},
    };

    const initialRepo: Repo = fromJS(repoProps);

    const verifyBranch = (repo: Repo, branchName: string) => {
      const branches: RepoBranches = repo.get("branches");
      if(!branches.has(branchName)) {
        throw Error("the branch does not exist: "+branchName);
      }
    }

    const stateReduce = (mutableRepo: Repo, repo: Repo, action: Action): void => {
      if(!Object.isFrozen()) {
        throw new Error("Action object is not frozen");
      }
      const options: RepoOptions = mutableRepo.get("options");
      const history: number = options.get("history");
      const currentBranch: string = mutableRepo.get("currentBranch");
      verifyBranch(repo, currentBranch);
      const branches: RepoBranches = mutableRepo.get("branches");
      const branch: RepoBranch = branches.get(currentBranch);

      const newBranch: RepoBranch = branch.withMutations((mutableBranch: RepoBranch) => {
        let currentIndex: number = mutableBranch.get("currentIndex");
        const live: boolean = mutableBranch.get("live");
        const states: List<State> = mutableBranch.get("states");
        const actions: List<Action> = mutableBranch.get("actions");
        const state: State = states.get(states.size-1);
        const newState: State = stateReducer(state, action);
        const newStates: List<State> = states.withMutations((mutableStates: List<State>) => {
          mutableStates.push(newState);
          while(mutableStates.size > history) {
            mutableStates.shift();
            if(currentIndex > 0) {
              currentIndex--;
            }
          }
        });
        const newActions: List<Action> = actions.withMutations((mutableActions: List<Action>) => {
          const actionCopy = action;
          mutableActions.push(actionCopy);
          while(mutableActions.size > history) {
            mutableActions.shift();
          }
        });
        if(live) {
          currentIndex = newStates.size - 1;
        }
        mutableBranch.set("currentIndex", currentIndex);
        mutableBranch.set("states", newStates)
        mutableBranch.set("actions", newActions)
      });
      const newBranches: RepoBranches = branches.set(currentBranch, newBranch);

      mutableRepo.set("branches", newBranches);
    };

    const repoReduceMutable = (mutableRepo: Repo, repo: Repo, action: Action): void => {
      switch (action.type) {
        case 'DUXEN_INIT': {      
          const initAction: InitAction = cast(action);
          const rbp: RepoBranchProps = {
            currentIndex: 0,
            live: true,
            states: [fromJS(initAction.state)],
            actions: [action],
          };
          mutableRepo.set("currentBranch", "master");
          mutableRepo.set("branches", fromJS({'master': rbp}));
          break;
        }

        case 'DUXEN_CREATE_BRANCH': {
          const repoAction: CreateBranchAction = cast(action);
          const branches: RepoBranches = repo.get("branches");
          if(branches.has(repoAction.branchName)) {
            throw Error("the branch already exists: "+repoAction.branchName);
          }
          const newBranch: RepoBranch = initialRepo.getIn(["branches", "master"]);
          const newBranches = branches.set(repoAction.branchName, newBranch);
          mutableRepo.set("branches", newBranches);
          break;
        }

        case 'DUXEN_SWITCH_BRANCH': {
          const repoAction: SwitchBranchAction = cast(action);
          verifyBranch(repo, repoAction.branchName);
          mutableRepo.set("currentBranch", repoAction.branchName);
          break;
        }

        case 'DUXEN_SAVE_BRANCH': {
          const repoAction: SaveBranchAction = cast(action);
          const currentBranch: string = mutableRepo.get("currentBranch");
          const branches: RepoBranches = repo.get("branches");
          const branch: RepoBranch = branches.get(currentBranch);
          const currentIndex: number = branch.get("currentIndex");
          const newBranch: RepoBranch = branch.withMutations((mutableBranch: RepoBranch): void => {
            const newStates: List<State> = mutableBranch.get("states").slice(0, currentIndex + 1);
            mutableBranch.set("states", newStates);
            const newActions: List<Action> = mutableBranch.get("actions").slice(0, currentIndex + 1);
            mutableBranch.set("actions", newActions);
            mutableBranch.set("currentIndex", currentIndex);
          });
          const newBranches = branches.set(repoAction.branchName, newBranch);
          mutableRepo.set("branches", newBranches);
          break;
        }

        case 'DUXEN_RESET_BRANCH': {
          const repoAction: ResetBranchAction = cast(action);
          verifyBranch(repo, repoAction.branchName);
          const currentBranch: string = mutableRepo.get("currentBranch");
          const branches: RepoBranches = repo.get("branches");
          const branch: RepoBranch = branches.get(repoAction.branchName);
          const currentIndex: number = branch.get("currentIndex");
          const newBranch: RepoBranch = branch.withMutations((mutableBranch: RepoBranch): void => {
            const newStates: List<State> = mutableBranch.get("states").slice(0, currentIndex + 1);
            mutableBranch.set("states", newStates);
            const newActions: List<Action> = mutableBranch.get("actions").slice(0, currentIndex + 1);
            mutableBranch.set("actions", newActions);
            mutableBranch.set("currentIndex", currentIndex);
          });
          const newBranches = branches.set(currentBranch, newBranch);
          mutableRepo.set("branches", newBranches);
          break;
        }

        case 'DUXEN_REMOVE_BRANCH': {
          const repoAction: RemoveBranchAction = cast(action);
          verifyBranch(repo, repoAction.branchName);
          const currentBranch: string = mutableRepo.get("currentBranch");
          if(currentBranch === repoAction.branchName) {
            throw Error("cannot remove branch that is current");
          }
          const branches: RepoBranches = repo.get("branches");
          const newBranches = branches.remove(repoAction.branchName);
          mutableRepo.set("branches", newBranches);
          break;
        }

        case 'DUXEN_GO_FORWARD': {
          const repoAction: GoForwardAction = cast(action);
          const currentBranch: string = mutableRepo.get("currentBranch");
          const branches: RepoBranches = repo.get("branches");
          const branch: RepoBranch = branches.get(currentBranch);
          const currentIndex: number = branch.get("currentIndex");
          const states: List<State> = branch.get("states");
          const steps: number = repoAction.steps;
          const newBranch: RepoBranch = branch.withMutations((mutableBranch: RepoBranch): void => {
            let newCurrentIndex = currentIndex + steps;
            if(newCurrentIndex < 0) {
              newCurrentIndex = 0;
            } else if(newCurrentIndex >= states.size) {
              newCurrentIndex = states.size - 1;
            }
            mutableBranch.set("currentIndex", newCurrentIndex);
            mutableBranch.set("live", false);
          });
          const newBranches = branches.set(currentBranch, newBranch);
          mutableRepo.set("branches", newBranches);
          break;
        }

        case 'DUXEN_GO_BACK': {
          const repoAction: GoBackAction = cast(action);
          const currentBranch: string = mutableRepo.get("currentBranch");
          const branches: RepoBranches = repo.get("branches");
          const branch: RepoBranch = branches.get(currentBranch);
          const currentIndex: number = branch.get("currentIndex");
          const states: List<State> = branch.get("states");
          const steps: number = repoAction.steps;
          const newBranch: RepoBranch = branch.withMutations((mutableBranch: RepoBranch): void => {
            let newCurrentIndex = currentIndex - steps;
            if(newCurrentIndex < 0) {
              newCurrentIndex = 0;
            } else if(newCurrentIndex >= states.size) {
              newCurrentIndex = states.size - 1;
            }
            mutableBranch.set("currentIndex", newCurrentIndex);
            mutableBranch.set("live", false);
          });
          const newBranches = branches.set(currentBranch, newBranch);
          mutableRepo.set("branches", newBranches);
          break;
        }

        case 'DUXEN_GO_LIVE': {
          const currentBranch: string = mutableRepo.get("currentBranch");
          const branches: RepoBranches = repo.get("branches");
          const branch: RepoBranch = branches.get(currentBranch);
          const states: List<State> = branch.get("states");
          const newBranch: RepoBranch = branch.withMutations((mutableBranch: RepoBranch): void => {
            let newCurrentIndex = states.size - 1;
            mutableBranch.set("currentIndex", newCurrentIndex);
            mutableBranch.set("live", true);
          });
          const newBranches = branches.set(currentBranch, newBranch);
          mutableRepo.set("branches", newBranches);
          break;
        }

        default: {
          stateReduce(mutableRepo, repo, action);
          break;
        }
      }
    };

    const repoReduce: RepoReducer = (repo: Repo, action: Action): Repo => {
      if(repo === undefined) {
        repo = initialRepo;
      }

      return repo.withMutations((mutableRepo: Repo): void => {
        repoReduceMutable(mutableRepo, repo, action);
      });

    };

    return repoReduce;
  }
}
