# easypaisa-mcp

MCP server for Easypaisa mobile wallet and payments (Pakistan). Supports mobile account payments, OTC payments, token generation, refunds, and transaction inquiries. Uses credential-based HMAC authentication.

## Tools (8)

| Tool | Description |
|------|-------------|
| `create_payment` | Create a payment |
| `check_status` | Check payment status |
| `create_ma_payment` | Mobile account payment |
| `inquire_transaction` | Inquire about a transaction |
| `create_otc_payment` | Over-the-counter payment |
| `generate_token` | Generate a payment token |
| `refund_payment` | Refund a payment |
| `get_statement` | Get transaction statement |

## Quick Start

```json
{
  "mcpServers": {
    "easypaisa": {
      "command": "npx",
      "args": ["-y", "@theyahia/easypaisa-mcp"],
      "env": {
        "EASYPAISA_STORE_ID": "<YOUR_STORE_ID>",
        "EASYPAISA_HASH_KEY": "<YOUR_HASH_KEY>"
      }
    }
  }
}
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `EASYPAISA_STORE_ID` | Yes | Store ID from Easypaisa merchant portal |
| `EASYPAISA_HASH_KEY` | Yes | Hash key for HMAC signatures |

## Demo Prompts

- "Create an Easypaisa payment of 5000 PKR to 03451234567"
- "Check status of order ORD-001"
- "Create an OTC payment for 3000 PKR"
- "Generate a payment token for 10000 PKR"
- "Get my transaction statement for April 2026"

## License

MIT
