interface Array<T> {
    remove(item: T): void;
}
// Implementation of the `remove` method
Array.prototype.remove = function<T>(this: T[], item: T): void {
    const index = this.indexOf(item);
    if (index > -1) {
        this.splice(index, 1);
    }
};
