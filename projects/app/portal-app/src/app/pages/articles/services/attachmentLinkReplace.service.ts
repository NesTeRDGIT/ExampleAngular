import { Injectable } from "@angular/core";
import { HtmlSourceFindService } from "@components-lib";
import { ApiService } from "@shared-lib";

@Injectable({ providedIn: 'root' })
/** Сервис замены ссылок на Attachment  */
export class AttachmentLinkReplaceService {
    private htmlSourceFindService = new HtmlSourceFindService();

    constructor(private apiService: ApiService) {

    }

    /** Заменить в документе HTML все ссылки на attachment на относительные ссылки */
    convertDocumentToRelativeLink = (htmlText: string) : string => {
        const urls = this.htmlSourceFindService.find(htmlText);
        urls.forEach(url => {
            if (this.isAttachmentUrl(url)) {
                const newURL = this.toRelativeLink(url);
                htmlText = htmlText.replace(url, newURL);
            }
        })
        return htmlText;
    }

    /** Заменить в документе HTML все ссылки на attachment на абсолютные ссылки */
    convertDocumentToAbsoluteLink = (htmlText: string) : string => {
        const urls = this.htmlSourceFindService.find(htmlText);
        urls.forEach(url => {
            if (this.isAttachmentUrl(url)) {
                const newURL = this.toAbsoluteLink(url);
                htmlText = htmlText.replace(url, newURL);
            }
        })
        return htmlText;
    }

    /** Заменить URL на абсолютный */
    convertToAbsoluteLink = (srcUrl: string) : string => {
        if (this.isAttachmentUrl(srcUrl)) {
            return this.toAbsoluteLink(srcUrl);
        }
        return srcUrl;
    }

    /** Является ли URL указателем на вложение */
    private isAttachmentUrl = (url: string): boolean => {
        return url.toLowerCase().includes('articles/attachment');
    }

    private toRelativeLink = (source: string): string => {
        if(source.startsWith('http')){
            const url = new URL(source);
            return url.pathname;
        }
        return source;
    }

    private toAbsoluteLink = (source: string): string => {
        let path = source;
        if(source.startsWith('http')){
            const url = new URL(source);
            path = url.pathname;
        }
        return this.apiService.GetUrl(path);
    }
}