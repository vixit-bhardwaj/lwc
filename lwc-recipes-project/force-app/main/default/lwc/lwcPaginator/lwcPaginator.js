/**
 * @description       : 
 * @author            : Vixit Bhardwaj - TA AtoS
 * @group             : 
 * @last modified on  : 01-10-2021
 * @last modified by  : Vixit Bhardwaj - TA AtoS
 * Modifications Log 
 * Ver   Date         Author                     Modification
 * 1.0   01-10-2021   Vixit Bhardwaj - TA AtoS   Initial Version
**/
import { LightningElement,api } from 'lwc';

export default class LwcPaginator extends LightningElement {
    start = 1;
    end = 1;
    currentPage = 1;
    totalRecords;
    @api recordSize = 5;
    totalPage = 0;

    @api isTrueTemplate = false;



    get records(){
        return this.visibleRecords;
    }
    @api 
    set records(data){
        if(data){
            this.totalRecords = data;
            this.recordSize = Number(this.recordSize);
            this.totalPage = Math.ceil(this.totalRecords.length/this.recordSize);
            this.updateRecords();
        }
    };

    handlePrevious() {
        if(this.currentPage > 1){
            this.currentPage = this.currentPage - 1;
            this.updateRecords();
        }
        this.dispatchEvent(new CustomEvent('previous'));
    }

    handleNext() {
        if(this.currentPage < this.totalPage){
            this.currentPage = this.currentPage + 1;
            this.updateRecords();
        }
        this.dispatchEvent(new CustomEvent('next'));
    }

    get disablePrevious(){
        return this.currentPage  <= 1;
    }

    get disableNext(){
        return this.currentPage  >= this.totalPage;
    }

    updateRecords(){
        this.start = (this.currentPage-1) * this.recordSize;
        this.end = this.recordSize * this.currentPage;
        this.visibleRecords = this.totalRecords.slice(this.start, this.end);

        if(this.totalRecords.length > this.recordSize){
            this.isTrueTemplate = true;
        }

        this.dispatchEvent (new CustomEvent ('updaterecords',{
            detail : {
                records:this.visibleRecords,
            }
        }));
    }

}