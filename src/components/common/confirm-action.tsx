'use client';

import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';

interface ConfirmActionProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
    variant?: 'default' | 'destructive';
}

export default function ConfirmAction({
    open,
    onOpenChange,
    title,
    description,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    onConfirm,
    onCancel,
    variant = 'default',
}: ConfirmActionProps) {
    const handleConfirm = () => {
        onConfirm();
        onOpenChange(false);
    };

    const handleCancel = () => {
        onCancel?.();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white border border-gray-200 rounded-lg max-w-md" showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        {variant === 'destructive' && <AlertTriangle className="h-6 w-6 text-red-600" />}
                        {title}
                    </DialogTitle>
                    {description && <DialogDescription className="text-sm text-gray-600 mt-2">{description}</DialogDescription>}
                </DialogHeader>

                <DialogFooter className="flex gap-3 sm:justify-end mt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium cursor-pointer"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        type="button"
                        variant={variant === 'destructive' ? 'destructive' : 'default'}
                        onClick={handleConfirm}
                        className={`px-4 py-2 rounded-lg font-medium cursor-pointer ${
                            variant === 'destructive' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                    >
                        {confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
