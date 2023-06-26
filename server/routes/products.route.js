import { Router } from "express";
import { StatusCode } from "status-code-enum";
import validateProduct from "../validators/product.validator";
import { validateImage } from "../validators/image.validator";
import productModel from "../schemas/products.schema";
import multer from "multer";
import { promises as fsPromises } from "fs";

var storage = multer.diskStorage({
  destination: "images/",
  filename: (req, file, cb) => {
    const { originalname } = file;
    req.body.imageName = originalname;
    cb(null, originalname);
  },
});

export const productsRouter = (imageStorage) => {
  const router = Router();
  const upload = multer({ storage });

  router.get("/products", async (req, res) => {
    try {
      const products = await productModel.find();

      if (!products?.length) {
        return res
          .status(StatusCode.ClientErrorNotFound)
          .send("product not found in database");
      }

      res.json(products);
    } catch (error) {
      console.error(error);
      return res.status(StatusCode.ServerErrorInternal).send("internal error");
    }
  });

  router.post("/product", upload.single("image"), async (req, res) => {
    try {
      const result = validateProduct(req.body);

      if (result.error) {
        return res
          .status(StatusCode.ClientErrorBadRequest)
          .send(result.error.message);
      }
      const imgPath = `images/${req.body.imageName}`;
      const image = await imageStorage.upload(imgPath);
      await fsPromises.unlink(imgPath);
      const newProduct = {
        ...req.body,
        imageName: image,
      };
      const product = await new productModel(newProduct).save();

      res.status(StatusCode.SuccessCreated).json(product);
    } catch (error) {
      console.error(error);
      return res.status(StatusCode.ServerErrorInternal).send("internal error");
    }
  });

  router.get("/product-url", async (req, res) => {
    try {
      const result = validateImage(req.query);
      if (result.error) {
        return res
          .status(StatusCode.ClientErrorBadRequest)
          .send(result.error.message);
      }
      // const imageBelongsToUser = await productModel.findOne({
      //   _id: req.user.id,
      //   imageName: req.query.imageName,
      // });
      // if (!imageBelongsToUser) {
      //   return res
      //     .status(StatusCode.ClientErrorForbidden)
      //     .send("image not available");
      // }
      const url = await imageStorage.getUrl(req.query.imageName);
      res.json(url);
    } catch (e) {
      console.error(error);
      return res.status(StatusCode.ServerErrorInternal).send("internal error");
    }
  });

  router.put("/products/:id", upload.single("image"), async (req, res) => {
    try {
      const result = validateProduct(req.body);

      if (result.error) {
        return res
          .status(StatusCode.ClientErrorBadRequest)
          .send(result.error.message);
      }

      const image = await imageStorage.upload(`images/${req.body.imageName}`);

      const product = await productModel.findByIdAndUpdate(req.params.id, {
        ...req.body,
        imageName: image,
      });

      res.json(product);
    } catch (error) {
      console.error(error);
      return res.status(StatusCode.ServerErrorInternal).send("internal error");
    }
  });

  router.delete("/products/:id", async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await productModel.findByIdAndDelete(productId);
      if (!product) {
        return res
          .status(StatusCode.ClientErrorBadRequest)
          .json("product not exist!");
      }

      res.status(StatusCode.SuccessNoContent).send();
    } catch (error) {
      console.error(error);
      return res.status(StatusCode.ServerErrorInternal).send("internal error");
    }
  });

  return router;
};
