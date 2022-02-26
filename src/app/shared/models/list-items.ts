export interface IActionItemClickedArgs {
    action: Actions;
    item?: any;
}

export type Actions = 'add' | 'edit' | 'delete' | 'save' | 'cancel' | 'yes' | 'no';

export enum ActionClicked {
    Add = 'add',
    Edit = 'edit',
    Delete = 'delete',
    Save = 'save',
    Cancel = 'cancel',
    Yes = 'yes',
    No = 'no'
};
