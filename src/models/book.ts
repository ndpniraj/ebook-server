import { Model, ObjectId, Schema, Types, model } from "mongoose";

export interface BookDoc {
  author: Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  language: string;
  publishedAt: Date;
  publicationName: string;
  genre: string;
  price: {
    mrp: number;
    sale: number;
  };
  cover?: {
    id: string;
    url: string;
  };
  fileInfo: {
    id: string;
    size: string;
  };
}

const bookSchema = new Schema<BookDoc>({
  author: {
    type: Schema.Types.ObjectId,
    ref: "Author",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  language: {
    type: String,
    required: true,
    trim: true,
  },
  publicationName: {
    type: String,
    required: true,
    trim: true,
  },
  genre: {
    type: String,
    required: true,
    trim: true,
  },
  publishedAt: {
    type: Date,
    required: true,
  },
  price: {
    type: Object,
    required: true,
    mrp: {
      type: Number,
      required: true,
    },
    sale: {
      type: Number,
      required: true,
    },
  },
  cover: {
    url: String,
    id: String,
  },
  fileInfo: {
    type: Object,
    required: true,
    url: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
});

const BookModel = model("Book", bookSchema);

export default BookModel as Model<BookDoc>;
