import { LoadState } from '@download-lib';
import { IConvertible, ValidationModelBase } from "@shared-lib";
import { Attachment } from "../model/Attachment";
import { AttachmentType } from '@ArticlesModuleRoot/model/AttachmentType';

/** Вложение */
export class AttachmentViewModel extends ValidationModelBase<AttachmentViewModel> implements IConvertible<Attachment> {

  constructor() {
    super();
  }

  /** Идентификатор */
  Id = 0;

  /** Идентификатор статьи */
  ArticleId = 0;

  /** Наименование */
  Name = '';

  /** Тип вложения */
  Type = new AttachmentType();

  /** Файл */
  File: File | null = null;

  /** Статус загрузки */
  State = LoadState.Default();


  private _isPdf = false;
  /** Является ли вложение файлом PDF */
  get isPdf(): boolean {
    return this._isPdf;
  }

  private _isImage = false;
  /** Является ли вложение файлом изображение */
  get isImage(): boolean {
    return this._isImage;
  }

  update(source: Attachment): void {
    this.Id = source.Id;
    this.ArticleId = source.ArticleId;
    this.Name = source.Name;
    this.Type = source.Type;
    this._isPdf = this.checkExtension(this.Name, 'pdf');
    this._isImage = this.checkExtension(this.Name, 'jfif', 'pip', 'jpg', 'pjpeg', 'jpeg','png', 'gif', 'bmp', 'dib', 'webp', 'tif', 'tiff' );
    this.SetUntouched();
  }

  convert(): Attachment {
    const dest = new Attachment();
    dest.Id = this.Id;
    dest.ArticleId = this.ArticleId;
    dest.Name = this.Name;
    dest.Type = this.Type;
    return dest;
  }

  private checkExtension(filename: string, ...extensions: string[]) : boolean {
    filename.toLowerCase();
    const pattern = `^.*.(${extensions.join('|').toLocaleLowerCase()})$`;
    return RegExp(pattern).test(filename.toLocaleLowerCase())
  }
}