<<<<<<< HEAD
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
=======
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "cdn-icons-png.flaticon.com",
      "i.pinimg.com",
>>>>>>> 0c9ba23994a8847a596f4fc74ddc6f328a5c606c
      "images.unsplash.com",
      "example.com",
      "file.hstatic.net",
      "sushiworld.com.vn",
      "cdn.tgdd.vn",
      "www.shogun.nl",
      "ussinavietnam.vn",
      "satovietnhat.com.vn",
      "saigonreview.vn",
      "plus.unsplash.com",
      "wallpapers.com",
      "media.istockphoto.com",
      "t3.ftcdn.net",
      "phongcachmoc.vn",
      "cdn.pastaxi-manager.onepas.vn",
      "xuongmocso1.com",
      "fnb.qdc.vn",
      "pastaxi-manager.onepas.vn",
      "image.phunuonline.com.vn",
      "media.suckhoecong.vn",
      "xkld.thanhgiang.com.vn",
      "i0.wp.com",
      "kokugyu.com.vn",
      "product.hstatic.net",
      "vn.fishroe.net",
      "bizweb.dktcdn.net",
      "tournhatban.net",
      "bioplanet.vn",
      "danviet.ex-cdn.com",
      "res.klook.com",
      "thedotmagazine.com",
      "www.elledecoration.vn",
      "scontent.fsgn5-5.fna.fbcdn.net",
      "scontent.fsgn5-9.fna.fbcdn.net",
      "scontent.fsgn5-14.fna.fbcdn.net",
      "cdn.nhandan.vn",
      "127.0.0.1",
      "kenh14cdn.com",
    ],
<<<<<<< HEAD
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:8000/api/:path*", // Laravel backend
      },
    ];
=======
>>>>>>> 0c9ba23994a8847a596f4fc74ddc6f328a5c606c
  },
};

module.exports = nextConfig;
