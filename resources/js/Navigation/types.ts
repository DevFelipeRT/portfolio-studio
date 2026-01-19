export type AuthUser = {
    name: string;
    email: string;
    avatar?: string | null;
};

export type NavigationLinkItem = {
    id: string;
    label: string;
    kind: 'link';
    href: string;
    isActive?: boolean;
    children?: NavigationItem[];
};

export type NavigationSectionItem = {
    id: string;
    label: string;
    kind: 'section';
    targetId?: string;
    scrollToTop?: boolean;
    children?: NavigationItem[];
};

export type NavigationGroupItem = {
    id: string;
    label: string;
    kind: 'group';
    children?: NavigationItem[];
};

export type NavigationItem =
    | NavigationLinkItem
    | NavigationSectionItem
    | NavigationGroupItem;

export type NavigationProps = {
    items: NavigationItem[];
    user?: AuthUser | null;
};

export type SectionPosition = {
    id: string;
    top: number;
};

export type SectionTargetNode = {
    identity: string;
    node: NavigationSectionItem;
};
