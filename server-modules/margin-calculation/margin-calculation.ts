
export const process = async (
  item: sbt.Item,
  Fees: typeof import('../fees/fees'),
  Postage: typeof import("../postage/postage"),
  Packaging: typeof import("../packaging/packaging")
) => {
  item.MD = {}
  if (item.SKU === "10BFCLRGE") {
    console.log(item.SHOPPRICEINCVAT)
    console.log(item.QSPRICEINCVAT)
  }
  await channelPrice(item);
  await getPostAndPackaging(item, Postage, Packaging);
  await getAMAZListingCosts(item, Fees);
  await getQSListingCosts(item, Fees);
  await getEBAYListingCosts(item, Fees);
  await getSHOPListingCosts(item, Fees);
  await getLastYearChannelProfits(item);
  return
}

const channelPrice = async (item: sbt.Item) => {
  if (!item.CP) item.CP = {}
  if (!item.AMZPRICEINCVAT) item.AMZPRICEINCVAT = item.CP.AMAZON ? item.CP.AMAZON.PRICE : "0";
  if (!item.EBAYPRICEINCVAT) item.EBAYPRICEINCVAT = item.CP.EBAY ? item.CP.EBAY.PRICE : "0";
  if (!item.QSPRICEINCVAT) item.QSPRICEINCVAT = item.CP.MAGENTO ? item.CP.MAGENTO.PRICE : "0";
  if (!item.SHOPPRICEINCVAT) item.SHOPPRICEINCVAT = item.CP.SHOP ? item.CP.SHOP.PRICE : "0";
  return
}

const getPostAndPackaging = async (item: sbt.Item, Postage: typeof import("../postage/postage"), Packaging: typeof import("../packaging/packaging")) => {

  let postage = Postage.data.get(item.POSTID!);
  let amzPost = Postage.data.get("30823674-1131-4087-a2d0-c50fe871548e")

  function modifyPostVal(postVal: number, mod: string | number) {
    if (!mod) mod = 0
    if (typeof mod === 'string') {
      switch (mod) {
        case 'x2': return postVal * 2
        case 'x3': return postVal * 3
        default: return postVal
      }
    } else {
      return postVal + mod
    }
  }

  item.MD!.PACKAGING = Packaging.data.has(item.PACKGROUP!) && Packaging.data.get(item.PACKGROUP!)!.PRICE
    ? Packaging.data.get(item.PACKGROUP!)!.PRICE
    : 0.1

  if (item.POSTMODID) {
    item.MD!.PRIMEPOSTAGEUK = modifyPostVal(amzPost!.POSTCOSTEXVAT, item.POSTMODID);
  } else {
    item.POSTMODID = 0
    item.MD!.PRIMEPOSTAGEUK = amzPost!.POSTCOSTEXVAT
  }

  item.MD!.POSTALPRICEUK = 0
  if (postage) {
    if (postage.POSTCOSTEXVAT) {
      if (item.POSTMODID) {
        item.MD!.POSTALPRICEUK = modifyPostVal(postage.POSTCOSTEXVAT, item.POSTMODID);
      } else {
        item.POSTMODID = 0
        item.MD!.POSTALPRICEUK = postage.POSTCOSTEXVAT
      }
    }
    return
  }
}

const getAMAZListingCosts = async (item: sbt.Item, Fees: typeof import("../fees/fees")) => {

  if (item.IDBFILTER === "domestic") {
    if (!item.AMZPRICEINCVAT) item.RETAILPRICE ? item.AMZPRICEINCVAT = item.RETAILPRICE.toString() : "0";
    if (!item.CP) item.CP = {}
    if (!item.CP.AMAZON) item.CP!.AMAZON = { PRICE: "", SUBSOURCE: "", UPDATED: "" }
    item.CP.AMAZON.updateReq = parseFloat(item.CP.AMAZON.PRICE) !== parseFloat(item.AMZPRICEINCVAT!)
  }

  if (!item.AMZPRICEINCVAT) {
    item.MD!.AMAZPAVC = 0;
    return
  } else {
    const price = parseFloat(item.AMZPRICEINCVAT)
    item.MD!.AMAZONFEES = Fees.calc('AMAZ', price)
    item.MD!.AMAZSALESVAT = price - (price / 1.2);

    item.MD!.AMAZPAVC = price - (item.PURCHASEPRICE! + item.MD!.POSTALPRICEUK! + item.MD!.PACKAGING! + item.MD!.AMAZSALESVAT + item.MD!.AMAZONFEES)
    item.MD!.PRIMEPAVC = price - (item.PURCHASEPRICE! + item.MD!.PRIMEPOSTAGEUK! + item.MD!.PACKAGING! + item.MD!.AMAZSALESVAT + item.MD!.AMAZONFEES)

    return
  }
}

const getEBAYListingCosts = async (item: sbt.Item, Fees: typeof import("../fees/fees")) => {

  if (item.IDBFILTER === "domestic") {
    if (!item.EBAYPRICEINCVAT) item.RETAILPRICE ? item.EBAYPRICEINCVAT = item.RETAILPRICE.toString() : "0";
    if (!item.CP) item.CP = {}
    if (!item.CP.EBAY) item.CP!.EBAY = { PRICE: "", SUBSOURCE: "", UPDATED: "" }
    item.CP.EBAY.updateReq = parseFloat(item.CP.EBAY.PRICE) !== parseFloat(item.EBAYPRICEINCVAT!)
  }

  if (!item.EBAYPRICEINCVAT) {
    item.MD!.EBAYUKPAVC = 0;
    return
  } else {
    const price = parseFloat(item.EBAYPRICEINCVAT);
    item.MD!.EBAYFEES = Fees.calc('EBAY', price)
    item.MD!.EBAYUKSALESVAT = price - (price / 1.2);

    item.MD!.EBAYUKPAVC = price - (item.PURCHASEPRICE! + item.MD!.POSTALPRICEUK! + item.MD!.PACKAGING! + item.MD!.EBAYUKSALESVAT + item.MD!.EBAYFEES)
    return
  }
}

const getQSListingCosts = async (item: sbt.Item, Fees: typeof import("../fees/fees")) => {

  if (item.IDBFILTER === "domestic") {
    item.QSPRICEINCVAT = item.RETAILPRICE!.toString() ? ((Math.floor((item.RETAILPRICE! * 100) * 0.95)) / 100).toString() : "0";
    if (!item.CP) item.CP = {}
    if (!item.CP.MAGENTO) item.CP!.MAGENTO = { PRICE: "", SUBSOURCE: "", UPDATED: "" }
    item.CP.MAGENTO.updateReq = parseFloat(item.CP.MAGENTO.PRICE) !== parseFloat(item.QSPRICEINCVAT)
  }

  if (!item.QSPRICEINCVAT) {
    item.MD!.QSPAVC = 0;
    return
  } else {
    const price = parseFloat(item.QSPRICEINCVAT);
    item.MD!.QSFEES = Fees.calc('QS', price)
    item.MD!.QSUKSALESVAT = price - (price / 1.2);

    item.MD!.QSPAVC = parseFloat(item.QSPRICEINCVAT) < 10
      ? price - (item.PURCHASEPRICE! + item.MD!.QSUKSALESVAT + item.MD!.QSFEES)
      : price - (item.PURCHASEPRICE! + item.MD!.POSTALPRICEUK! + item.MD!.PACKAGING! + item.MD!.QSUKSALESVAT + item.MD!.QSFEES)
    return
  }
}

const getSHOPListingCosts = async (item: sbt.Item, Fees: typeof import("../fees/fees")) => {
  if (item.SKU === "10BFCLRGE") {
    console.log(item.SHOPPRICEINCVAT)
    console.log(item.QSPRICEINCVAT)
  }
  if (!item.SHOPPRICEINCVAT || item.SHOPPRICEINCVAT === "0") {
    if (item.RETAILPRICE) {
      if (item.SKU === "10BFCLRGE") console.log("retail price found!")
      item.SHOPPRICEINCVAT = item.RETAILPRICE.toString()
    } else if (item.QSPRICEINCVAT) {
      if (item.SKU === "10BFCLRGE") console.log("qs price found!")
      item.SHOPPRICEINCVAT = item.QSPRICEINCVAT
    } else {
      if (item.SKU === "10BFCLRGE") console.log("no price found!")
      item.SHOPPRICEINCVAT = "0";
      item.MD!.SHOPPAVC = 0;
      return
    }
  } else {
      if (item.SKU === "10BFCLRGE") console.log("if not triggering!")
  }

  const price = parseFloat(item.SHOPPRICEINCVAT);
  item.MD!.SHOPUKSALESVAT = price - (price / 1.2);
  item.MD!.SHOPFEES = Fees.calc('SHOP', price)

  item.MD!.SHOPPAVC = price - (item.PURCHASEPRICE! + item.MD!.SHOPUKSALESVAT + item.MD!.SHOPFEES)
  return
}

const getLastYearChannelProfits = async (item: sbt.Item) => {
  if (!item.CD) return
  let year = (new Date().getFullYear()) - 1;
  let total = 0;

  if (!item.CD[year]) return

  let posEbay = item.CD[year].map(function(e) { return e.SOURCE }).indexOf("EBAY");
  if (posEbay !== -1) {
    item.MD!.EBAYPROFITLY = parseFloat(item.CD[year][posEbay].QTY) * item.MD!.EBAYUKPAVC!;
    total = total + item.MD!.EBAYPROFITLY
  }
  let posAmaz = item.CD[year].map(function(e) { return e.SOURCE }).indexOf("AMAZON");
  if (posAmaz !== -1) {
    item.MD!.AMAZPROFITLY = parseFloat(item.CD[year][posAmaz].QTY) * item.MD!.AMAZPAVC!;
    total = total + item.MD!.AMAZPROFITLY
  }
  let posWeb = item.CD[year].map(function(e) { return e.SOURCE }).indexOf("MAGENTO");
  if (posWeb !== -1) {
    item.MD!.QSPROFITLY = parseFloat(item.CD[year][posWeb].QTY) * item.MD!.QSPAVC!;
    total = total + item.MD!.QSPROFITLY
  }

  item.MD!.TOTALPROFITLY = total;
  if (!item.MD!.TOTALPROFITLY) item.MD!.TOTALPROFITLY = 0;
  return
}

