# 本地搜索库分片

`music_cache.db` 原始大小 102 MB，超过 GitHub 单文件 100 MB 限制，因此拆成 3 个约 34 MB 的分片。

- 原始 SHA256：`69db96e3cdc4e808a672ea5a95457613cb6917f1a3320ea5be514b9bbd01d415`
- 拼接顺序：`part001` → `part002` → `part003`
- 清单：`manifest.json`（每个分片的大小与 SHA256）
- 重组：按顺序二进制拼接后，校验清单中的总 SHA256
- 当前状态：随 App 打包在 `Resources/SearchDataParts/`；App 首次启动按清单拼接并校验 SHA256，然后以只读 SQLite 查询
- 重新生成：

```bash
python scripts/split-search-db.py \
  --source <music_cache.db> \
  --output Resources/SearchDataParts \
  --parts 3
```
