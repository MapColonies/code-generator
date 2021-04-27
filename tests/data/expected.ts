import { Column, Entity, Index, PrimaryColumn } from "typeorm";

@Entity({name: 'records'})
export class Metadata {
    @Column({name: 'identifier',type: 'text',nullable: true})
    public id?: string;
    @Column({name: 'version',type: 'text',nullable: true})
    public version?: string;
}
