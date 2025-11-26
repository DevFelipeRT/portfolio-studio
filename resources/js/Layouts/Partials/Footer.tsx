export default function Footer() {
    return (
        <footer className="bg-background border-border text-muted-foreground border-t py-4 text-sm">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <span>
                    © {new Date().getFullYear()} Portfolio. All rights
                    reserved.
                </span>
                <span className="hidden sm:inline">
                    Built with Laravel, Inertia and React.
                </span>
            </div>
        </footer>
    );
}
