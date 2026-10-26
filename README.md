# Mini WMS — React 18 + NestJS + PostgreSQL

功能：管理员登录、SKU 商品、库位、入库、出库、移库、实时库存、操作流水。
库存更新使用数据库事务及 SKU 级 advisory lock，防止并发扣成负数；业务单号唯一防重复。
**这是可部署的 MVP，不是经过生产安全审计的企业级 WMS。**

## Docker 启动
1. 安装 Docker Engine + Docker Compose plugin。
2. `cp .env.example .env`，修改所有密码和 JWT_SECRET（至少 32 字符）。
3. `docker compose up -d --build`
4. 打开 `http://服务器IP:8080`，使用 .env 的 ADMIN_USERNAME / ADMIN_PASSWORD 登录。
5. 首先创建 SKU 和库位，然后使用入库操作增加库存。

### macOS 终端提示 `command not found: docker`

安装并启动 Docker Desktop 后，重新打开终端，再检查：

```sh
docker --version
docker compose version
docker info
```

若已安装 Docker Desktop，但当前终端仍找不到命令，可先执行：

```sh
export PATH="$HOME/.docker/bin:$PATH"
docker compose up -d --build
```

如果 `docker info` 提示无法连接服务，请等待 Docker Desktop 启动完成。
首次启动需要下载镜像和安装依赖，耗时取决于网络速度。
已有 `.env` 时无需再次复制，重复执行 `cp .env.example .env` 会覆盖已设置的密码。
本项目不依赖 Java；终端中的 Java Runtime 提示需要单独检查 shell 的 Java 配置。

## 生产 HTTPS
建议在前面使用云负载均衡器或 Caddy/Traefik 配置域名、TLS 证书、HTTPS，
只暴露 443，限制 8080 仅由反向代理访问。数据库端口不对公网开放。
生产上线前需要配置自动备份、监控告警、访问控制、密码轮换、漏洞扫描、审计和恢复演练。

## 本地开发
PostgreSQL 建库 wms，配置 DATABASE_URL、JWT_SECRET、ADMIN_USERNAME、ADMIN_PASSWORD。
`npm install`
`cd api && npm run migrate && npm run dev`
另开终端 `cd web && npm run dev`。
本地前端 `http://localhost:5173`。

## API
POST /api/auth/login
GET/POST /api/products
GET/POST /api/locations
GET /api/stock
GET/POST /api/movements

移动操作请求：
`{"reference":"IN-001","type":"IN","productId":"UUID","toLocationId":"UUID","quantity":10}`
出库 OUT 填 fromLocationId，移库 TRANSFER 同时填 fromLocationId 和 toLocationId。
所有业务接口需要 Authorization: Bearer <token>。

## 当前边界
单仓基础库存，不含批次/效期/序列号/盘点/拣货波次/多租户/RBAC/报表导出。
当前 JWT 存储于 sessionStorage；生产环境建议升级为 HttpOnly cookie + CSRF 防护、
增加登录限流和专门的用户管理与权限控制。
