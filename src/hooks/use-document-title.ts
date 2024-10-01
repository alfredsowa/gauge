function useDocumentTitle(pageTitle?: string|null): void {
    let fullTitle: string = import.meta.env.VITE_APP_NAME

    if (pageTitle) {
        fullTitle = `${pageTitle} - ${fullTitle}`;
    }

    document.title = fullTitle;
}

export default useDocumentTitle