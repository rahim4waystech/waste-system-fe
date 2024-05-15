import { Injectable } from '@angular/core';

// pagination for the nation
@Injectable({
  providedIn: 'root',
})
export class PaginationService {
    private page: number = 1;
    private amountPerPage: number = 10;
    private totalRecords: number = 0;
    private paginatedTotal: number = 0;

    getPage(): number {
        return this.page;
    }

    getPaginatedTotal(): number {
        return this.paginatedTotal;
    }

    setPaginatedTotal(total: number): void {
        this.paginatedTotal = total;
    }

    setPage(page: number): void {
        if(page < 1 || page === null || page === undefined) {
            throw new Error('Pagination: Please provide a valid page number');
        }

        this.page = page;
    }

    getAmountPerPage(): number {
        return this.amountPerPage;
    }

    setAmountPerPage(amount: number): void {
        if(amount < 1 || amount === null || amount === undefined) {
            throw new Error('Pagination: Please provide a valid page amount');
        }
        this.amountPerPage = amount;
    }

    getTotalRecords(): number {
        return this.totalRecords;
    }

    setTotalRecords(amount: number): void {
        if(amount < 0 || amount === null || amount === undefined) {
            throw new Error('Pagination: Please provide a valid total amount of records');
        }
        this.totalRecords = amount;
    }

    getTotalPages(): number {
        const totalPages = Math.ceil(this.totalRecords / this.amountPerPage);


        return totalPages;
    }

    public getOffsetStart(): number {
        if (this.totalRecords === 0) {
            return 0;
        }
        return (this.page - 1) * this.amountPerPage + 1;
    }


    public getOffsetEnd(): number {
        if (this.totalRecords >= this.getPaginatedTotal()) {
            return ((this.page - 1) * this.amountPerPage + this.paginatedTotal);
        } else {
            return this.totalRecords;
        }
    }

    public isNextActive(): boolean {
        return this.page !== this.getTotalPages() && this.totalRecords !== 0;
    }

    public isPrevActive(): boolean {
        return this.page !== 1;
    }

    public getShortPagesRange(c, m) {

        const current = c;
        const last = m;
        const delta = 2;
        const left = current - delta;
        const right = current + delta + 1;
        const range = [];
        const rangeWithDots = [];

        let l = null;
        range.push(1);

        for (let i = c - delta; i <= c + delta; i++) {
            if (i >= left && i < right && i < m && i > 1) {
                range.push(i);
            }
        }
        range.push(m);
        for (const i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }

            }
            rangeWithDots.push(i);
            l = i;
        }
        return rangeWithDots;

    }

 



}
