"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allDataCombined = exports.getRentPrice = exports.getSalaries = exports.getAllAreas = exports.areaStats = exports.servedArea = void 0;
const areas_json_1 = __importDefault(require("../data/areas.json"));
const stats_json_1 = __importDefault(require("../data/stats.json"));
const lockedArea_json_1 = __importDefault(require("../data/lockedArea.json"));
const cheerio = __importStar(require("cheerio"));
const axios_1 = __importDefault(require("axios"));
const getAllAreas = (req, res) => {
    return res.status(200).json({
        success: true,
        message: "All areas fetched successfully",
        data: areas_json_1.default
    });
};
exports.getAllAreas = getAllAreas;
const servedArea = (req, res) => {
    try {
        const allServedAreas = areas_json_1.default
            .filter(area => area.isServed === true)
            .map((_a) => {
            var { geometry } = _a, rest = __rest(_a, ["geometry"]);
            const stats = stats_json_1.default.find(stat => Number(stat.pinCode) == rest.pinCode);
            return Object.assign(Object.assign({}, rest), { stats: stats || null });
        });
        res.status(200).json({
            success: true,
            message: "Served areas fetched successfully",
            data: allServedAreas
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.servedArea = servedArea;
const areaStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pinCode } = req.params;
        const areaData = areas_json_1.default.find(area => area.pinCode == pinCode);
        if (!areaData) {
            return res.status(404).json({
                success: false,
                message: 'Area not found for the given pin code',
            });
        }
        console.log("Area data:", areaData);
        if (areaData.isServed) {
            const areaStats = stats_json_1.default.find(stat => stat.pinCode == pinCode);
            return res.status(200).json({
                success: true,
                message: 'Area stats found',
                data: areaStats || {},
            });
        }
        const lockedData = lockedArea_json_1.default.find(area => area.pinCode == pinCode);
        console.log("Locked data:", lockedData);
        let wikiData = null;
        if (areaData.wiki_name) {
            try {
                const wikiResponse = yield fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(areaData.wiki_name)}`);
                if (wikiResponse.ok) {
                    wikiData = yield wikiResponse.json();
                }
                else {
                    console.warn(`Wikipedia page not found for ${areaData.wiki_name}`);
                }
            }
            catch (wikiError) {
                console.error("Error fetching wiki summary:", wikiError);
            }
            pinCode;
        }
        return res.status(200).json({
            success: true,
            message: wikiData ? 'Locked area stats and wiki summary found' : 'Locked area stats found (wiki data unavailable)',
            data: {
                isLocked: true,
                pinCode,
                areaName: areaData.name,
                lockedData: lockedData || {},
                wikiData: wikiData || null,
            },
        });
    }
    catch (error) {
        console.error("Internal server error:", error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
exports.areaStats = areaStats;
// for getting served and locked areas with their stats -> chat @ functionality
const allDataCombined = (req, res) => {
    const allServedAreas = areas_json_1.default
        .filter(area => area.isServed === true)
        .map((_a) => {
        var { geometry } = _a, rest = __rest(_a, ["geometry"]);
        const stats = stats_json_1.default.find(stat => Number(stat.pinCode) === Number(rest.pinCode));
        return Object.assign(Object.assign({}, rest), { stats: stats || null });
    });
    const allLockedAreas = areas_json_1.default
        .filter(area => area.isServed === false)
        .map((_a) => {
        var { geometry } = _a, rest = __rest(_a, ["geometry"]);
        const lockedData = lockedArea_json_1.default.find(lock => Number(lock.pinCode) === Number(rest.pinCode));
        return Object.assign(Object.assign({}, rest), { lockedData: lockedData || null });
    });
    return res.status(200).json({
        success: true,
        message: "Served and locked areas fetched successfully",
        servedAreas: allServedAreas,
        lockedAreas: allLockedAreas,
    });
};
exports.allDataCombined = allDataCombined;
const getSalaries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { pinCode } = req.body;
    const area = (_a = areas_json_1.default.find(area => area.pinCode == pinCode)) === null || _a === void 0 ? void 0 : _a.name;
    const query = `top+companies+in+${area}+Bangalore`;
    try {
        const googleApiRes = yield axios_1.default.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${process.env.GOOGLE_API_KEY}`);
        if (googleApiRes.data.status !== "OK") {
            return res.status(500).json({
                message: "Error fetching data from Google Places API",
            });
        }
        const topCompanies = googleApiRes.data.results.slice(0, 5).map(company => ({
            name: company.name,
            logo: company.icon,
            address: company.formatted_address || "",
        }));
        const names = googleApiRes.data.results.map(result => result.name.split(" ").join("-"));
        const fetchSalaries = names.map((rawName) => __awaiter(void 0, void 0, void 0, function* () {
            const companyName = rawName;
            const URL = `https://www.ambitionbox.com/salaries/${companyName}-salaries/bengaluru-location`;
            try {
                const response = yield axios_1.default.get(URL, {
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                        "Accept-Language": "en-US,en;q=0.9",
                    },
                });
                const $ = cheerio.load(response.data);
                const roles = [];
                $("tr.jobProfiles-table__row").each((_, element) => {
                    const title = $(element).find(".card-content__company").text().trim();
                    const salaryText = $(element)
                        .find(".salary-range")
                        .text()
                        .replace(/\s+/g, " ")
                        .trim();
                    const match = salaryText.match(/₹([\d.]+)\s*L\/yr\s*-\s*₹([\d.]+)\s*L\/yr/);
                    if (title && match) {
                        const minSalary = Math.round(parseFloat(match[1]) * 100000);
                        const maxSalary = Math.round(parseFloat(match[2]) * 100000);
                        const avgSalary = Math.round((minSalary + maxSalary) / 2);
                        roles.push({ title, avgSalary });
                    }
                });
                return roles;
            }
            catch (_a) {
                return [];
            }
        }));
        const allRolesArrays = yield Promise.all(fetchSalaries);
        const allRoles = allRolesArrays.flat();
        // Buckets
        const buckets = {
            "0-5LPA": 0,
            "5-10LPA": 0,
            "10-15LPA": 0,
            "15-20LPA": 0,
            "20-25LPA": 0,
            "25-30LPA": 0,
            "30LPA+": 0,
        };
        for (const role of allRoles) {
            const salaryLPA = role.avgSalary / 100000;
            if (salaryLPA <= 5)
                buckets["0-5LPA"]++;
            else if (salaryLPA <= 10)
                buckets["5-10LPA"]++;
            else if (salaryLPA <= 15)
                buckets["10-15LPA"]++;
            else if (salaryLPA <= 20)
                buckets["15-20LPA"]++;
            else if (salaryLPA <= 25)
                buckets["20-25LPA"]++;
            else if (salaryLPA <= 30)
                buckets["25-30LPA"]++;
            else
                buckets["30LPA+"]++;
        }
        const total = allRoles.length;
        const distribution = {};
        for (const [range, count] of Object.entries(buckets)) {
            distribution[range] = {
                count,
                percentage: total > 0 ? ((count / total) * 100).toFixed(2) + "%" : "0%",
            };
        }
        return res.status(200).json({
            message: "Salary role distribution calculated",
            pinCode,
            area,
            totalRoles: total,
            distribution,
            topCompanies,
            success: true,
        });
    }
    catch (err) {
        return res.status(500).json({
            message: "Unexpected error while processing",
            error: err.message,
            success: false,
        });
    }
});
exports.getSalaries = getSalaries;
const getRentPrice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const defaultRentBuckets = {
        upto10k: 0,
        "10to20k": 0,
        "20to30k": 0,
        "30to40k": 0,
        above40k: 0,
    };
    try {
        const { pinCode } = req.body;
        if (!pinCode) {
            return res.status(400).json({ message: "Pin code is required" });
        }
        const areaName = (_a = areas_json_1.default.find((area) => area.pinCode == pinCode)) === null || _a === void 0 ? void 0 : _a.name;
        if (!areaName) {
            return res.status(404).json({
                message: "Area not found for the given pin code",
                rentBuckets: defaultRentBuckets,
                properties: [],
            });
        }
        const fetchProperties = axios_1.default.post("https://swrapi.sowerent.com/api/v1/website/property/listings", {
            pageSize: 100,
            pageNo: 1,
            locations: [areaName],
            preferredTenants: "",
            budgetFrom: 0,
            budgetTo: 1000000,
            carpetAreaFrom: null,
            carpetAreaTo: null,
            tags: "",
            furnished: "",
            managedBy: "",
            availability: null,
            sortBy: "",
        });
        const [response] = yield Promise.all([fetchProperties]);
        const rawProperties = ((_b = response === null || response === void 0 ? void 0 : response.data) === null || _b === void 0 ? void 0 : _b.result) || [];
        if (rawProperties.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No properties found for the given area",
                areaName,
                rentBuckets: defaultRentBuckets,
                properties: [],
            });
        }
        const properties = rawProperties.map((p, index) => ({
            id: index + 1,
            rent: p.flatRent || 0,
        }));
        const rentBuckets = Object.assign({}, defaultRentBuckets);
        for (const { rent } of properties) {
            if (rent <= 10000)
                rentBuckets.upto10k++;
            else if (rent <= 20000)
                rentBuckets["10to20k"]++;
            else if (rent <= 30000)
                rentBuckets["20to30k"]++;
            else if (rent <= 40000)
                rentBuckets["30to40k"]++;
            else
                rentBuckets.above40k++;
        }
        return res.status(200).json({
            success: true,
            message: "Rent summary fetched successfully",
            areaName,
            rentBuckets,
            properties,
        });
    }
    catch (error) {
        console.error("Error fetching flat rents:", error.message);
        return res.status(200).json({
            success: false,
            message: "Error occurred while fetching rent data",
            areaName: "Unknown",
            rentBuckets: defaultRentBuckets,
            properties: [],
        });
    }
});
exports.getRentPrice = getRentPrice;
