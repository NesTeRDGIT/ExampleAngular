import { ArgumentNullException, CheckPropertyService, Convert, InvalidCastException } from "@shared-lib";

/** Тип вложения */
export class AttachmentType {
    /** Код */
    Value: AttachmentTypeValue = "";

    /** Наименование */
    Name = "";

    /** По умолчанию */
    static get Default(): AttachmentType {
        const value = new AttachmentType();
        value.Name = '';
        value.Value = '';
        return value;
    }

    /** Системное */
    static get System(): AttachmentType {
        const value = new AttachmentType();
        value.Name = 'Системное';
        value.Value = 'system';
        return value;
    }

    static Create(source: any): AttachmentType {
        if (source === null || source === undefined) {
            throw new ArgumentNullException("source");
        }
        const dest = new AttachmentType();
        const errField = CheckPropertyService.CheckProperty(dest, source);

        if (errField.length !== 0) {
            throw new Error(`Не удалось найти поля: ${errField.join(",")}`);
        }

        dest.Value = getAttachmentTypeValue(Convert.ConvertToString(source.Value));
        dest.Name = Convert.ConvertToString(source.Name);
        return dest;
    }
}


export function getAttachmentTypeValue(value: string): AttachmentTypeValue {
    switch (value) {
        case '': return value;
        case 'system': return value;
        default:
            throw new InvalidCastException(value, `AttachmentTypeValue`);
    }
}

/** Код типа вложения */
export type AttachmentTypeValue = '' | 'system';