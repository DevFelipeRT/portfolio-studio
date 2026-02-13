import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import React from 'react';

type LocaleSwapDialogProps = {
    open: boolean;
    currentLocale: string;
    nextLocale: string;
    onConfirmSwap: () => void;
    onConfirmNoSwap: () => void;
    onCancel: () => void;
};

export function LocaleSwapDialog({
    open,
    currentLocale,
    nextLocale,
    onConfirmSwap,
    onConfirmNoSwap,
    onCancel,
}: LocaleSwapDialogProps) {
    return (
        <Dialog open={open} onOpenChange={(value) => !value && onCancel()}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Conflito de locale</DialogTitle>
                    <DialogDescription className="space-y-3 text-sm">
                        <span className="block">
                            Já existe uma tradução para o locale{' '}
                            <span className="font-medium">{nextLocale}</span>.
                        </span>
                        <span className="block">
                            Se você escolher <strong>Sim</strong>, o conteúdo atual
                            da base ({currentLocale}) será salvo como tradução e o
                            conteúdo da tradução de {nextLocale} passa a ser a base.
                        </span>
                        <span className="block">
                            Se escolher <strong>Não</strong>, apenas o locale base será
                            alterado.
                        </span>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2">
                    <Button variant="ghost" onClick={onCancel}>
                        Cancelar
                    </Button>
                    <Button variant="secondary" onClick={onConfirmNoSwap}>
                        Não
                    </Button>
                    <Button onClick={onConfirmSwap}>Sim</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
