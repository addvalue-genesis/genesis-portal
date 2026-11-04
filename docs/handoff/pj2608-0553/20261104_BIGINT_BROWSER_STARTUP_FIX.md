# 0553 blank page — BigInt browser transpilation fix

Owner Chrome console reports `TypeError: Cannot convert a BigInt value to a
number` in `Math.pow` → Common `quotationRounding.js` → option rollup →
`PJ26080553` render. Continue from PR56 head
`2ec58183def8a16d1024f434abb738179934087e`.

## Cause and fix

The Common scale helper used `10n ** BigInt(n)`. Webpack's default
`@babel/preset-env` lowers exponentiation to `Math.pow(10n, BigInt(n))`.
`Math.pow` accepts Numbers, so the full app throws before its default page
finishes rendering. Earlier data/SSR tests targeted current Node and retained
the native BigInt exponent; successful webpack compilation did not execute it.

Use cached exact BigInt multiplication to build powers of ten. Keep the same
decimal arithmetic, equation/policy version and results. Do not change global
Babel targets, convert money to floating point or change a quoted value to
work around the crash. No Module IDs, source prices, quantities, FX, margins,
archives, baseline records or browser storage are migrated or deleted.

## Regression coverage

`validate-0553-browser-startup.cjs` reads **the actual Babel loader options from
webpack.config.js**, transforms the full0553 application using that browser
configuration and renders the real default route through a synthetic browser
location/history and server renderer. It accesses no user browser/storage.

Before the fix, this test reproduced the owner's exact BigInt/Math.pow stack in
`PJ26080553` / option rollup. After the fix it must render the project shell,
execute decimal rounding/allocation to scale36 and preserve all current A/B/C
targets, base USD894910, B11/B12 null/N/A and options outside base.

The test is included in `npm run build:0553`. This is a browser-compilation
runtime regression, not a claim of real-browser DOM/effects/IndexedDB acceptance.
Existing Common snapshot/backup/control tests and exact native XLSX checks
remain separate. Original source/Official model outputs are compared without
rewriting frozen snapshots or fixtures.

## User continuation

Update the existing PR56 branch
`work/pj2608-0553-common-quotation-baseline-20261104`, stop the previous3053
development server, then run `npm run start:0553` from frontend. Refresh the
existing0553 page. Keep browser storage and saved quotation backups intact.
Do not merge or issue a customer quotation as part of this startup repair.
