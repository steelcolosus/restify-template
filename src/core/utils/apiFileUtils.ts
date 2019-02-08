import { logger } from "../lib";
import * as fs from 'fs'

export class ApiFileUtils {
    public handleUpload(baseName: string, files: any) {
        try {
            if (files) console.log(files);
            for (var key in files) {
                if (files.hasOwnProperty(key)) {
                    const image: any = files[key]
                    baseName = `${baseName}-${image.name}`;
                    fs.renameSync(image.path, `${process.cwd()}/src/public/images/${baseName}`);
                }
            }
            return baseName;
        } catch (error) {
            logger.error(error);
            return undefined;
        }
    }
}

export const apiFileUilts = new ApiFileUtils();