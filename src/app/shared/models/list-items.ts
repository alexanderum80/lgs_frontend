export interface IActionItemClickedArgs {
    action: Actions;
    item?: any;
}

export type Actions = 'add' | 'edit' | 'delete' | 'save' | 'set' | 'cancel' | 'yes' | 'no' | 'finish';

export enum ActionClicked {
    Add = 'add',
    Edit = 'edit',
    Delete = 'delete',
    Save = 'save',
    Set = 'set',
    Cancel = 'cancel',
    Yes = 'yes',
    No = 'no',
    Finish = 'finish'
};
