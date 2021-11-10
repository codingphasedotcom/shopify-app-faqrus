import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import Shopify, { ApiVersion } from "@shopify/shopify-api";
import Koa from "koa";
import next from "next";
import Router from "koa-router";
import {PrismaClient} from '@prisma/client';
import {storeCallback, loadCallback, deleteCallback} from './custom-sessions.js';
import bodyParser from 'koa-bodyparser';
import slugify from "slugify";


const  {user, faq, question, appSession} = new PrismaClient(); 

dotenv.config();
const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});
const handle = app.getRequestHandler();

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOSTLOCAL.replace(/https:\/\//, ""),
  API_VERSION: ApiVersion.October20,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  SESSION_STORAGE: new Shopify.Session.CustomSessionStorage(
    storeCallback,
    loadCallback,
    deleteCallback
  ),
});

// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
// const ACTIVE_SHOPIFY_SHOPS = {};

app.prepare().then(async () => {
  const server = new Koa();
  const router = new Router();
  server.use(bodyParser());
  server.keys = [Shopify.Context.API_SECRET_KEY];
  server.use(
    createShopifyAuth({
      async afterAuth(ctx) {
        // Access token and shop available in ctx.state.shopify
        const { shop, accessToken, scope } = ctx.state.shopify;
        // console.log(ctx.state)
        // console.log(ctx.state.shopify)
        const host = ctx.query.host;
        // ACTIVE_SHOPIFY_SHOPS[shop] = scope;

        const newUser = await user.upsert({
          where:{ shop: shop},
          update: {shop: shop, scope: scope, updated_at: new Date().toISOString()},
          create: {shop: shop, scope: scope, updated_at: new Date().toISOString()}
        })

        const response = await Shopify.Webhooks.Registry.register({
          shop,
          accessToken,
          path: "/webhooks",
          topic: "APP_UNINSTALLED",
          webhookHandler: async (shop) =>
            await user.delete({where: {shop: shop}}),
        });

        if (!response.success) {
          console.log(
            `Failed to register APP_UNINSTALLED webhook: ${response.result}`
          );
        }

        // Redirect to app with shop parameter upon auth
        ctx.redirect(`/?shop=${shop}&host=${host}`);
      },
    })
  );

  const handleRequest = async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };

  router.post("/webhooks", async (ctx) => {
    try {
      await Shopify.Webhooks.Registry.process(ctx.req, ctx.res);
      console.log(`Webhook processed, returned status code 200`);
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
    }
  });

  router.post(
    "/graphql",
    verifyRequest({ returnHeader: true }),
    async (ctx, next) => {
      await Shopify.Utils.graphqlProxy(ctx.req, ctx.res);
    }
  );

  // FAQ Routes
  // GET ALL FAQ
  router.get(
    "/faq",
    verifyRequest({ returnHeader: true }),
    async (ctx, next) => {
      try {
      let user_id = await user.findFirst({
        where: { shop: ctx.query.shop}
      })
      user_id = user_id.id
      
      const response = await faq.findMany({
        where: {
          user_id: user_id
        },
        orderBy: {
          created_at: 'desc'
        }
      })

      return ctx.body = {
        status: 'success',
        data: response
      }
      } catch (error) {
        console.log(error)
        return ctx.body = {
          status: 'error',
          message: `FAQ can't be safed`
        }
      }
      
      console.log(newFaq)
    }
  );
  // SAVE SINGLE FAQ
  router.post(
    "/faq",
    verifyRequest({ returnHeader: true }),
    async (ctx, next) => {
      try {
        const {title, description, status} = ctx.request.body;
      let user_id = await user.findFirst({
        where: { shop: ctx.query.shop}
      })
      user_id = user_id.id
      

      const newFaq = await faq.create({
        data: {
          title: title,
          slug: slugify(title, '-'),
          description: description,
          status: status,
          user_id: user_id,
          dynamic: false,
          updated_at: new Date().toISOString()
        },
      })

      return ctx.body = {
        status: 'success',
        data: newFaq
      }
      } catch (error) {
        console.log(error)
        return ctx.body = {
          status: 'error',
          message: `FAQ can't be safed`
        }
      }
      
      console.log(newFaq)
    }
  );
  //GET SINGLE FAQ
  router.get(
    "/faq/:faqId",
    verifyRequest({ returnHeader: true }),
    async (ctx, next) => {
      try {
        let results = await faq.findFirst({
          where: { id: parseInt(ctx.params.faqId)}
        })

        return ctx.body = {
          status: 'success',
          data: results
        }
      } catch (error) {
        console.log(error)
        return ctx.body = {
          status: 'error',
          message: 'FAQ not found'
        }
      }
      
    }
  );
  //UPDATE SINGLE FAQ
  router.put(
    "/faq/:faqId",
    verifyRequest({ returnHeader: true }),
    async (ctx, next) => {
      try {
        const {title, description, status} = ctx.request.body;
      let user_id = await user.findFirst({
        where: { shop: ctx.query.shop}
      })
      user_id = user_id.id
      

      const newFaq = await faq.update({
        where: {
          id: parseInt(ctx.params.faqId)
        },
        data: {
          title: title,
          slug: slugify(title, '-'),
          description: description,
          status: status,
          user_id: user_id,
          dynamic: false,
          updated_at: new Date().toISOString()
        },
      })

      return ctx.body = {
        status: 'success',
        data: newFaq
      }
      } catch (error) {
        console.log(error)
        return ctx.body = {
          status: 'error',
          message: "Error Can't Edit FAQ"
        }
      }
    }
  );
  //DELETE SINGLE FAQ
  router.del(
    "/faq/:faqId",
    verifyRequest({ returnHeader: true }),
    async (ctx, next) => {
      try {
        const delFaq = await faq.delete({
          where: {
            id: parseInt(ctx.params.faqId)
          }
        })
  
        return ctx.body = {
          status: 'success',
          data: delFaq
        }
      } catch (error) {
        console.log(error)
        return ctx.body = {
          status: 'error',
          message: "Error Can't Delete FAQ"
        }
      }
    }
  );


  // QA Routes
  // GET ALL QA
  router.get(
    "/faq/:faqId/qa",
    verifyRequest({ returnHeader: true }),
    async (ctx, next) => {
      try {
      let user_id = await user.findFirst({
        where: { shop: ctx.query.shop}
      })
      user_id = user_id.id
      
      const response = await qa.findMany({
        where: {
          faq_id: parseInt(ctx.params.faqId)
        },
        orderBy: {
          created_at: 'desc'
        }
      })

      return ctx.body = {
        status: 'success',
        data: response
      }
      } catch (error) {
        console.log(error)
        return ctx.body = {
          status: 'error',
          message: `FAQ can't be safed`
        }
      }
      
      console.log(newFaq)
    }
  );
  // SAVE SINGLE QA
  router.post(
    "/faq/:faqId/qa",
    verifyRequest({ returnHeader: true }),
    async (ctx, next) => {
      try {
        const {title, answer} = ctx.request.body;
      let user_id = await user.findFirst({
        where: { shop: ctx.query.shop}
      })
      user_id = user_id.id
      

      const newQA = await question.create({
        data: {
          title: title,
          answer: answer,
          user: { connect: { id: user_id } },
          faq: { connect: { id: parseInt(ctx.params.faqId) } },
          views: 0,
          updated_at: new Date().toISOString()
        },
      })

      return ctx.body = {
        status: 'success',
        data: newQA
      }
      } catch (error) {
        console.log(error)
        return ctx.body = {
          status: 'error',
          message: `QA can't be saved`
        }
      }
      
      console.log(newFaq)
    }
  );
  //GET SINGLE FAQ
  router.get(
    "/faq/:faqId/qa/:qaId",
    verifyRequest({ returnHeader: true }),
    async (ctx, next) => {
      try {
        let results = await question.findFirst({
          where: { id: parseInt(ctx.params.qaId)}
        })

        return ctx.body = {
          status: 'success',
          data: results
        }
      } catch (error) {
        console.log(error)
        return ctx.body = {
          status: 'error',
          message: 'QA not found'
        }
      }
      
    }
  );
  //UPDATE SINGLE FAQ
  router.put(
    "/faq/:faqId/qa/:qaId",
    verifyRequest({ returnHeader: true }),
    async (ctx, next) => {
      try {
        const {title, answer} = ctx.request.body;
      let user_id = await user.findFirst({
        where: { shop: ctx.query.shop}
      })
      user_id = user_id.id
      

      const updateQa = await question.update({
        where: {
          id: parseInt(ctx.params.qaId)
        },
        data: {
          title: title,
          answer: answer,
          user_id: user_id,
          views: 0,
          updated_at: new Date().toISOString()
        },
      })

      return ctx.body = {
        status: 'success',
        data: updateQa
      }
      } catch (error) {
        console.log(error)
        return ctx.body = {
          status: 'error',
          message: "Error Can't Edit FAQ"
        }
      }
    }
  );
  //DELETE SINGLE FAQ
  router.del(
    "/faq/:faqId/qa/:qaId",
    verifyRequest({ returnHeader: true }),
    async (ctx, next) => {
      try {
        const delQa = await question.delete({
          where: {
            id: parseInt(ctx.params.qaId)
          }
        })
  
        return ctx.body = {
          status: 'success',
          data: delQa
        }
      } catch (error) {
        console.log(error)
        return ctx.body = {
          status: 'error',
          message: "Error Can't Delete FAQ"
        }
      }
    }
  );


  router.get("(/_next/static/.*)", handleRequest); // Static content is clear
  router.get("/_next/webpack-hmr", handleRequest); // Webpack content is clear
  router.get("(.*)", async (ctx) => {
    const shop = ctx.query.shop;
    // console.log('ACTIVE_SHOPIFY_SHOPS')
    // console.log(ACTIVE_SHOPIFY_SHOPS)

    const checkShop = await appSession.findFirst({
      where: { shop: shop}
    })

    // This shop hasn't been seen yet, go through OAuth to create a session
    if (checkShop === null) {
      ctx.redirect(`/auth?shop=${shop}`);
    } else {
      await handleRequest(ctx);
    }
  });

  server.use(router.allowedMethods());
  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
