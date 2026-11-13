const GUEPEX_API_URL = "https://api.guepex.app/v1/";
const GUEPEX_ORIGIN_WILAYA_ID = 15;

interface GuepexWilaya {
    id: number;
    name: string;
    is_deliverable?: boolean | number | string;
}

interface GuepexCommune {
    id: number;
    name: string;
    wilaya_id: number;
    is_deliverable?: boolean | number | string;
}

interface GuepexListResponse<T> {
    data: T[];
    has_more: boolean;
}

interface GuepexFeesResponse {
    per_commune: Record<string, {
        commune_id: number;
        express_home: number | null;
        express_desk: number | null;
    }>;
}

class GuepexRequestError extends Error {
    constructor(message: string, readonly status: number) {
        super(message);
    }
}

function isDeliverable(value: boolean | number | string | undefined): boolean {
    return value === true || value === 1 || value === "1" || value === "true";
}

async function requestGuepex<T>(
    resource: string,
    params: Record<string, string>,
    revalidate: number,
): Promise<T> {
    const apiId = process.env["X-API-ID"];
    const apiToken = process.env["X-API-TOKEN"];

    if (!apiId || !apiToken) {
        throw new GuepexRequestError("Guepex API credentials are not configured", 503);
    }

    const url = new URL(resource, GUEPEX_API_URL);
    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

    const response = await fetch(url, {
        headers: {
            Accept: "application/json",
            "X-API-ID": apiId,
            "X-API-TOKEN": apiToken,
        },
        next: { revalidate },
    });

    if (!response.ok) {
        const status = response.status === 401 || response.status === 403 ? response.status : 502;
        throw new GuepexRequestError(`Guepex API returned ${response.status}`, status);
    }

    return response.json() as Promise<T>;
}

async function listGuepexData<T>(
    resource: string,
    params: Record<string, string>,
): Promise<T[]> {
    const results: T[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
        const response = await requestGuepex<GuepexListResponse<T>>(
            resource,
            { ...params, page: String(page), page_size: "1000" },
            3600,
        );

        if (!Array.isArray(response.data)) {
            throw new GuepexRequestError("Guepex returned an invalid location list", 502);
        }

        results.push(...response.data);
        hasMore = response.has_more === true;
        page += 1;
    }

    return results;
}

function parseId(value: string | null): number | null {
    if (!value || !/^\d+$/.test(value)) return null;
    const id = Number(value);
    return Number.isSafeInteger(id) ? id : null;
}

function isWilayaId(value: number): boolean {
    return value >= 1 && value <= 58;
}

export async function GET(request: Request) {
    const searchParams = new URL(request.url).searchParams;
    const resource = searchParams.get("resource");

    try {
        if (resource === "wilayas") {
            const wilayas = await listGuepexData<GuepexWilaya>("wilayas/", {});
            return Response.json({ data: wilayas.filter((wilaya) => isDeliverable(wilaya.is_deliverable)) });
        }

        if (resource === "communes") {
            const wilayaId = parseId(searchParams.get("wilayaId"));
            if (!wilayaId || !isWilayaId(wilayaId)) {
                return Response.json({ error: "رقم الولاية غير صالح." }, { status: 400 });
            }

            const communes = await listGuepexData<GuepexCommune>("communes/", {
                wilaya_id: String(wilayaId),
            });
            return Response.json({
                data: communes.filter((commune) => isDeliverable(commune.is_deliverable)),
            });
        }

        if (resource === "fees") {
            const wilayaId = parseId(searchParams.get("wilayaId"));
            const communeId = parseId(searchParams.get("communeId"));
            if (!wilayaId || !isWilayaId(wilayaId) || !communeId) {
                return Response.json({ error: "يرجى اختيار الولاية والبلدية." }, { status: 400 });
            }

            const fees = await requestGuepex<GuepexFeesResponse>(
                "fees/",
                {
                    from_wilaya_id: String(GUEPEX_ORIGIN_WILAYA_ID),
                    to_wilaya_id: String(wilayaId),
                },
                300,
            );
            const communeFees = fees.per_commune?.[String(communeId)]
                ?? Object.values(fees.per_commune ?? {}).find((item) => item.commune_id === communeId);

            if (
                !communeFees
                || typeof communeFees.express_home !== "number"
                || typeof communeFees.express_desk !== "number"
            ) {
                return Response.json({ error: "لا تتوفر أسعار توصيل لهذه البلدية." }, { status: 404 });
            }

            return Response.json({
                data: {
                    home: communeFees.express_home,
                    office: communeFees.express_desk,
                },
            });
        }

        return Response.json({ error: "طلب غير صالح." }, { status: 400 });
    } catch (error) {
        console.error("Guepex checkout request failed:", error);
        const status = error instanceof GuepexRequestError ? error.status : 502;
        const message = status === 401 || status === 403
            ? "رفضت Guepex بيانات الاعتماد. تحقق من X-API-ID وX-API-TOKEN."
            : status === 503
                ? "بيانات اعتماد Guepex غير مهيأة على الخادم."
                : "تعذر تحميل بيانات التوصيل. يرجى المحاولة مرة أخرى.";
        return Response.json(
            { error: message },
            { status },
        );
    }
}
