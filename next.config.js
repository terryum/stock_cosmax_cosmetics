/** @type {import('next').NextConfig} */
const nextConfig = {
  // 이미지 도메인 설정 (뉴스 썸네일 등)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // 환경 변수 공개 설정
  env: {
    NEXT_PUBLIC_APP_NAME: 'Cosmax Market Insight',
  },
};

module.exports = nextConfig;
