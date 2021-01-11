/**
 * @description       : 
 * @author            : Vixit Bhardwaj - TA AtoS
 * @group             : 
 * @last modified on  : 01-11-2021
 * @last modified by  : Vixit Bhardwaj - TA AtoS
 * Modifications Log 
 * Ver   Date         Author                     Modification
 * 1.0   01-10-2021   Vixit Bhardwaj - TA AtoS   Initial Version
**/
import { LightningElement, track, api, wire } from 'lwc';
import saveFiles from "@salesforce/apex/MultipleFileController.saveFiles";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import releatedFiles from "@salesforce/apex/MultipleFileController.releatedFiles";

import { getPicklistValues } from "lightning/uiObjectInfoApi";
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import CONTENTVERSION_OBJECT from "@salesforce/schema/ContentVersion";
import DOCUMENT_TYPE_FIELD from "@salesforce/schema/ContentVersion.Document_Type__c";

const columns = [
  {
    label: "Title",
    fieldName: "recordLink",
    type: "url",
    typeAttributes: {
      label: { fieldName: "Title" },
      target: "_blank"
    },
    wrapText: false,
    sortable: true
  },
  {
    label: "Document Type",
    fieldName: "Document_Type__c",
    sortable: true,
    type: "Text"
  },
  {
    label: "Last Modified Date",
    fieldName: "LastModifiedDate",
    type: "date",
    sortable: true
  }
];
export default class LwcMultipleFileUploader extends LightningElement {
    @api recordId;
    @track fileNames = "";
    @track filesUploaded = [];
  
    @track showLoadingSpinner = false;
    @track isTrue = false;
    @track columns = columns;
  
    @track data = '';
    @track fileType = "";
  
    @wire(getObjectInfo, { objectApiName: CONTENTVERSION_OBJECT })
    objectInfo;
  
    @wire(getPicklistValues, {
      recordTypeId: "$objectInfo.data.defaultRecordTypeId",
      fieldApiName: DOCUMENT_TYPE_FIELD
    })
    DocumentTypePicklistValues;
  
    handleDocumentTypeChange(event) {
      this.fileType = event.detail.value;
    }
  
    handleFileChanges(event) {
      let files = event.target.files;
  
      if (files.length > 0) {
        let filesName = "";
  
        for (let i = 0; i < files.length; i++) {
          let file = files[i];
          filesName = filesName + file.name + ", ";
          let freader = new FileReader();
          freader.onloadend = (f) => {
            let base64 = "base64,";
            let content = freader.result.indexOf(base64) + base64.length;
            let fileContents = freader.result.substring(content);
            this.filesUploaded.push({
              Title: file.name,
              VersionData: fileContents
            });
          };
          freader.readAsDataURL(file);
        }
        this.fileNames = filesName.slice(0, -1);
      }
    }
  
    handleSaveFiles() {
         const isInputsCorrect = [...this.template.querySelectorAll('lightning-combobox')]
         .reduce((validSoFar, inputField) => {
             inputField.reportValidity();
             return validSoFar && inputField.checkValidity();
         }, true);
     if (isInputsCorrect) {
        this.showLoadingSpinner = true;
  
        saveFiles({
          idParent: this.recordId,
          filesToInsert: this.filesUploaded,
          strFileType: this.fileType
        })
          .then((data) => {
            window.console.log("result ====> " + data);
            // refreshing the datatable
            this.getRelatedFiles();
  
            this.showLoadingSpinner = false;
            this.isTrue = true;
            const showSuccess = new ShowToastEvent({
              title: "Success!!",
              message: this.fileNames + " files uploaded successfully.",
              variant: "Success"
            });
            this.dispatchEvent(showSuccess);
  
            this.fileNames = "";
            this.filesUploaded = [];
          })
          .catch((error) => {
            const showError = new ShowToastEvent({
              title: "Error!!",
              message: "An Error occur while uploading the file.",
              variant: "error"
            });
            this.dispatchEvent(showError);
          });
     }
    }
  
    connectedCallback() {
      this.getRelatedFiles();
    }
  
    // For Pagination
  
    totalFiles=[];
    @track
    visibleFiles;
  
    // Getting releated files of the current record
    getRelatedFiles() {
      releatedFiles({ idParent: this.recordId })
        .then((data) => {
          
              var tempList = [];
              if(data != null){

                for (var i = 0; i < data.length; i++) {  
                 let tempRecord = Object.assign({}, data[i]); 
                 tempRecord.recordLink = '/lightning/r/ContentDocument/' + tempRecord.ContentDocumentId + '/view';  
                 tempList.push(tempRecord);  
                }
                
                this.data = tempList;
                this.totalFiles = tempList;
              
              }
        })
        .catch((error) => {
          this.dispatchEvent(
            new ShowToastEvent({
              title: "Error!!",
              message: error.message,
              variant: "error"
            })
          );
        });
    }
  
    updateRecordHandler(event) {
      this.visibleFiles = [...event.detail.records];
    }
  
    defaultSortDirection = "asc";
    sortDirection = "asc";
    sortedBy;
  
    // Used to sort the 'Age' column
    sortBy(field, reverse, primer) {
      const key = primer
        ? function (x) {
            return primer(x[field]);
          }
        : function (x) {
            return x[field];
          };
  
      return function (a, b) {
        a = key(a);
        b = key(b);
        return reverse * ((a > b) - (b > a));
      };
    }
  
    onHandleSort(event) {
      const { fieldName: sortedBy, sortDirection } = event.detail;
      const cloneData = [...this.visibleFiles];
      cloneData.sort(this.sortBy(sortedBy, sortDirection === "asc" ? 1 : -1));
      this.visibleFiles = cloneData;
      this.sortDirection = sortDirection;
      this.sortedBy = sortedBy;
    }
  
    recordSize = 5;
    @track rowNumberOffset; //Row number
    page = 1;
  
    handlePrevious() {
      if (this.page > 1) {
        this.page = this.page - 1;
        this.rowNumberOffset = (this.page - 1) * this.recordSize;
      }
    }
  
    handleNext() {
      this.page = this.page + 1;
      this.rowNumberOffset = (this.page - 1) * this.recordSize;
    }

    
}