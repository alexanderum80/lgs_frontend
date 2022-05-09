export interface IActionItemClickedArgs {
    action: Actions;
    item?: any;
}

export type Actions = 'add' | 'edit' | 'delete' | 'save' | 'finish' | 'cancel' | 'yes' | 'no' | 'open' | 'close';

export enum ActionClicked {
    Add = 'add',
    Edit = 'edit',
    Delete = 'delete',
    Save = 'save',
    Finish = 'finish',
    Cancel = 'cancel',
    Yes = 'yes',
    No = 'no',
    Open = 'open',
    Close = 'close'
};
