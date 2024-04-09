import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema( 
{
  timestamps: false,
  strict: false
}
)
export class User extends Document {
  @Prop()
  name: string;

  @Prop({ unique: [true, 'Duplicate email entered'] })
  email: string;

  @Prop()
  password: string;

  // Define balances field as a Map type with keys as strings and values as numbers
  @Prop({ type: Map, of: Number, default: {} }) 
  balances: Map<string, number>;

}

export const UserSchema = SchemaFactory.createForClass(User);