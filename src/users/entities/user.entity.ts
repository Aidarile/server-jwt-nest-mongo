import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema()
export class User {

    @Prop()
    username: string;

    @Prop()
    password: string;

    @Prop()
    rol: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
