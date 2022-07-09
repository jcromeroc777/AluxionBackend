import { Schema, model } from 'mongoose';

const fileSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
},
{
    timestamps: true,
    versionKey: false
});

export default model('File', fileSchema);

 