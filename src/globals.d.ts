import { DBType, ORM } from "./orm";

declare global {
    var globalOrm: ORM<DBType> | undefined;
}