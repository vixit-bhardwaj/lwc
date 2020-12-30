/**
 * @description       : 
 * @author            : Vixit Bhardwaj - TA AtoS
 * @group             : 
 * @last modified on  : 12-27-2020
 * @last modified by  : Vixit Bhardwaj - TA AtoS
 * Modifications Log 
 * Ver   Date         Author                     Modification
 * 1.0   12-27-2020   Vixit Bhardwaj - TA AtoS   Initial Version
**/
import { LightningElement } from 'lwc';

export default class CompositionIteration extends LightningElement {
    contacts = [
        {
            Id: '003171931112854375',
            Name: 'Amy Taylor',
            Title: 'VP of Engineering',
            Phone: '6172559632',
            Sex:'F',
            Picture__c:
                'https://s3-us-west-1.amazonaws.com/sfdc-demo/people/amy_taylor.jpg'
        },
        {
            Id: '003192301009134555',
            Name: 'Michael Jones',
            Title: 'VP of Sales',
            Phone: '6172551122',
            Sex:'M',
            Picture__c:
                'https://s3-us-west-1.amazonaws.com/sfdc-demo/people/michael_jones.jpg'
        },
        {
            Id: '003848991274589432',
            Name: 'Jennifer Wu',
            Title: 'CEO',
            Phone: '6172558877',
            Sex:'F',
            Picture__c:
                'https://s3-us-west-1.amazonaws.com/sfdc-demo/people/jennifer_wu.jpg'
        }
    ];
}