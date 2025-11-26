import { Button } from '@/Components/Ui/button';
import { ButtonHTMLAttributes } from 'react';

type DangerButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * DangerButton renders a shadcn destructive button variant.
 */
export default function DangerButton({
    className = '',
    type = 'button',
    children,
    ...props
}: DangerButtonProps) {
    return (
        <Button
            type={type}
            variant="destructive"
            className={className}
            {...props}
        >
            {children}
        </Button>
    );
}
