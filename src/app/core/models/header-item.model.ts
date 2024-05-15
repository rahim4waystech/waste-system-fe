/**
 * A header item
 * 
 * @package SignIn
 * 
 * @Author Four Ways Technology
 */
export class HeaderItem {

    /* Name of the link */
    name: string = '';

    /* FontAwesome Icon for the header link */
    icon: string = '';

    /* fore colour of the item */
    foreColor: string = '';

    /* should the item be displayed or not */
    active: boolean = false;

    /* link for the item, routerLink if isexternal is false, otherwise full hyperlink */
    link: string = '';

    /* Is this a Angular internal link or an external one */
    isExternal: boolean = false;

    /** If this is provided the callback will be used instead of the provided link */
    action: any = null;
}