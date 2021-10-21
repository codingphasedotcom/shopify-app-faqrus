import { PrismaClient } from '@prisma/client';
import Shopify from '@shopify/shopify-api';
import { Session } from '@shopify/shopify-api/dist/auth/session';

const prisma = new PrismaClient();

module.exports.storeCallback = async function storeCallback(session){
  console.log('Running storeCallback')

  const payload = { ...session }
    console.log('StoreCallback session===============================')
    console.log(session)
    console.log('StoreCallback Payload===============================')
    console.log(payload)
    return prisma.appSession.upsert({
        where: { id: session.id },
        create: { id: session.id, payload: payload, shop: payload.shop },
        update: { payload: payload }
        
    }).then(_ => {
        return true
    }).catch(err => {
        return false
    })
}

module.exports.loadCallback = async function loadCallback(id) {
    console.log('loadCallback ID===============================')
        console.log(id)
    return prisma.appSession.findUnique({
        where: { id: id }
    }).then(data => {
        if (!data) {
            return undefined
        }

        const session = new Session(data.id)
        // @ts-ignore
        const { shop, state, scope, accessToken, isOnline, expires, onlineAccessInfo } = data.payload
        session.shop = shop
        session.state = state
        session.scope = scope
        session.expires = expires ? new Date(expires) : undefined
        session.isOnline = isOnline
        session.accessToken = accessToken
        session.onlineAccessInfo = onlineAccessInfo

        console.log('loadCallback New session Complete===============================')
        console.log(session)
        return session
    }).catch(err => {
        return undefined
    })
}


module.exports.deleteCallback = async function deleteCallback(id){
  console.log('deleteCallback ID===============================')
        console.log(id)
    return prisma.appSession.delete({
        where: { id: id }
    }).then(_ => {
        return true
    }).catch(err => {
        return false
    })
}