/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: '/**'
            }
        ],
    },
    async headers(){
        return [
            {
                source: '/(.*)',
                headers: [{
                    key: 'Referrer-Policy',
                    value: 'strict-origin-when-cross-origin'
                }]
            }
        ]
    }
};

export default nextConfig;
