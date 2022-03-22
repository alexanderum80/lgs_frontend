export interface IActionItemClickedArgs {
    action: Actions;
    item?: any;
}

export type Actions = 'add' | 'edit' | 'delete' | 'save' | 'finish' | 'cancel' | 'yes' | 'no' | 'init';

export enum ActionClicked {
    Add = 'add',
    Edit = 'edit',
    Delete = 'delete',
    Save = 'save',
    Finish = 'finish',
    Cancel = 'cancel',
    Yes = 'yes',
    No = 'no',
    Init = 'init',
};
