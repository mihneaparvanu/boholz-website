// HEAD-check every manifest URL. Report any non-200 or content-length mismatch.
import manifest from "../../image-manifest.json";

const R2_PUBLIC = "https://pub-47ece1c9a40d42ad8886561941b959b5.r2.dev";

let ok = 0,
  bad = 0;
const failures: string[] = [];

await Promise.all(
  manifest.assets.map(async (a) => {
    const url = `${R2_PUBLIC}/${a.r2Key}`;
    try {
      const res = await fetch(url, { method: "HEAD" });
      if (res.status !== 200) {
        bad++;
        failures.push(`${res.status} ${a.r2Key}`);
        return;
      }
      const len = parseInt(res.headers.get("content-length") ?? "0", 10);
      if (len !== a.optimizedSizeBytes) {
        bad++;
        failures.push(`SIZE ${len} vs ${a.optimizedSizeBytes} ${a.r2Key}`);
        return;
      }
      ok++;
    } catch (e) {
      bad++;
      failures.push(`ERR ${(e as Error).message} ${a.r2Key}`);
    }
  }),
);

console.log(`OK: ${ok}, BAD: ${bad}, TOTAL: ${manifest.assets.length}`);
if (failures.length) {
  console.log("\nFailures:");
  for (const f of failures.slice(0, 20)) console.log("  " + f);
}
process.exit(bad > 0 ? 1 : 0);
