import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Site } from "../entity/Site.entity";
import { Employee_Site } from "../entity/Employee_Site.entity";


export class SiteController {

    static async getEmployeeBySite(req: Request, res: Response) {

        const { site_id } = req.params;
        const siteRepository = AppDataSource.getRepository(Employee_Site);

        const employees = await siteRepository
        .createQueryBuilder("employee_site")
        .leftJoinAndSelect("employee_site.employee", "employee")
        .leftJoinAndSelect("employee_site.site", "site")
        .where("employee_site.siteId = :site_id", { site_id })
        .getMany();

        res.status(200).json({ message: "employees get to site successfully", employees: employees });

    }
    static async getAllSite(req: Request, res: Response) {

        const siteRepository = AppDataSource.getRepository(Site);

        const sitesList = await siteRepository.find();

        res.status(200).json({ message: "Site get successfully",  sitesList})

    }
    static async getAllEmployee(req: Request, res: Response) {

        const siteRepository = AppDataSource.getRepository(Employee_Site);

        const employees = await siteRepository
        .createQueryBuilder("employee_site")
        .leftJoinAndSelect("employee_site.employee", "employee")
        .leftJoinAndSelect("employee_site.site", "site")
        .getMany();

        res.status(200).json({ message: "employees get to site successfully", employees: employees });

    }
    static async addSite(req: Request, res: Response) {

        const { name, location, area } = req.body;
        const siteRepository = AppDataSource.getRepository(Site);

        const site = new Site();
        site.name = name;
        site.location = location;
        site.area = area;

        await siteRepository.save(site);
        res.status(200).json({ message: "site created successfully" });

    }
    static async updateSite(req: Request, res: Response) {

        const { site_id } = req.params;
        const { name, location, area } = req.body;
        const siteRepository = AppDataSource.getRepository(Site);

        const site = await siteRepository.findOne({
            where: { id: parseInt(site_id) },
        });
        site.name = name;
        site.location = location;
        site.area = area;

        await siteRepository.save(site);
        res.status(200).json({ message: "site updated successfully" });

    }
    static async deleteSite(req: Request, res: Response) {

        const { site_id } = req.params;
        const siteRepository = AppDataSource.getRepository(Site);

        const site = await siteRepository.findOne({
            where: { id: parseInt(site_id) },
        });
        await siteRepository.remove(site);
        res.status(200).json({ message: "site deleted successfully" });

    }
    static  async addEmployeeToSite(req: Request, res: Response) {

        const { site_id } = req.params;
        const { employee_id } = req.body;

        const employeeSiteRepository = AppDataSource.getRepository(Employee_Site);
        const employeeSite = new Employee_Site();
        employeeSite.site = parseInt(site_id);
        employeeSite.employee = employee_id;

        await employeeSiteRepository.save(employeeSite);
        res.status(200).json({ message: "employee added to site successfully" });

    }
    static async removeEmployeeFromSite(req: Request, res: Response) {

        const { employee_id } = req.body;
        const employeeSiteRepository = AppDataSource.getRepository(Employee_Site);

        const employeeSite = await employeeSiteRepository.findOne({
            where: { employee: employee_id },
        });
        await employeeSiteRepository.remove(employeeSite);
        res.status(200).json({ message: "employee removed from site successfully" });

    }

}