export interface Contact
{
    _id?: string;
    name?: string;
    surname?: string;
    city?: string;
    desc?: string;
    addedBy?: string;
    mobile_numbers?: [
        {
            number: string;
            type: string;
            desc?: string;
        }
    ];
    picture?: string;
}
