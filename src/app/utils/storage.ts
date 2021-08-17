export class Storage {
    private storage = sessionStorage;

    set(item: string, data) {
        this.storage.setItem(item, JSON.stringify(data));
    }

    get(item: string) {
        return JSON.parse(this.storage.getItem(item));
    }
    valSession(variable: string) {
       return this.storage.getItem(variable);
    }

    destroy(item: any) {
        this.storage.removeItem(item);
    }


    remove(item: string) {
        this.storage.removeItem(item);
    }

    clear() {
        this.storage.clear();
    }
}
