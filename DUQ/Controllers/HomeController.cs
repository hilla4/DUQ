﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Text.RegularExpressions;

namespace BakerySquared.Controllers
{
    [Authorize]
    /// <summary>
    /// Class containing the views for the Floor plans as well as controller methods to interact with database
    /// </summary>
    public class HomeController : Controller
    {

        [AllowAnonymous]
        /// <summary>
        /// Displays Floor page
        /// </summary>
        /// <returns> view containing floor data</returns>
        public ActionResult Floor1()
        {
            return View();
        }

        [AllowAnonymous]
        /// <summary>
        /// Displays Floor page
        /// </summary>
        /// <returns> view containing floor data</returns>
        public ActionResult Floor2()
        {
            return View();
        }

        [AllowAnonymous]
        /// <summary>
        /// Displays Floor page
        /// </summary>
        /// <returns> view containing floor data</returns>
        public ActionResult Floor3()
        {
            return View();
        }

        [AllowAnonymous]
        /// <summary>
        /// Displays Floor page
        /// </summary>
        /// <returns> view containing floor data</returns>
        public ActionResult Floor4()
        {
            return View();
        }

        [AllowAnonymous]
        /// <summary>
        /// Displays Floor page
        /// </summary>
        /// <returns> view containing floor data</returns>
        public ActionResult Floor5()
        {
            return View();
        }

        [AllowAnonymous]
        /// <summary>
        /// Displays Floor page
        /// </summary>
        /// <returns> view containing floor data</returns>
        public ActionResult Floor6()
        {
            return View();
        }

        /// <summary>
        /// takes the id sent from the client after user click and uses it to search the db
        /// </summary>
        /// <param name="id">id of the element that was clicked by user</param>
        /// <returns>returns Json string containing information for space</returns>
        [AllowAnonymous]
        [HttpGet]
        public ActionResult GetController(String id)
        {
            string returnString = null;
            try
            {
                if (returnString == null)
                {
                    if (Request.IsAuthenticated)
                    {
                        returnString = "True";
                    }
                    else
                    {
                        returnString = "Not Occupied";
                    }
                }
            }
            catch
            {
                returnString = "DB error";
            }

            return Json(returnString, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Will be used to remove all elements from the database from the current floor and refill it with
        /// the elements from the file. To be used to update DB after floor plan change.
        /// </summary>
        /// <param name="floor">a string that is passed from the client to get the specific floor user is on
        /// to update db</param>
        /// <returns>returns json string to client containing all floor location ids</returns>
        [HttpGet]
        public ActionResult refillDB(string floor)
        {
            string returnString = null;
            try
            {


                string ids = FileRegex(floor);
                string[] locations = ids.Split(' ');
                foreach (string d in locations)
                {
                    if (d.Length == 5)
                    {

                    }
                }

                returnString = "Completed";
            }
            catch
            {
                returnString = "DB error";
            }

            return Json(returnString, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// opens the file of the floor map made in editor and searches for all ids that match the regular expression
        /// </summary>
        /// <param name="floor"> a string that is passed from the client to get the specific floor user is on
        /// to update db</param>
        /// <returns> returns a string containing all the ids in the file that match the regular expression</returns>
        private string FileRegex(string floor)
        {
            Regex rx = new Regex("id=\"(M|D|S)[0-9]{4}\"",
                   RegexOptions.Compiled | RegexOptions.IgnoreCase);

            int counter = 0;
            string ids = "";
            string line;
            string path = HttpContext.Server.MapPath("~/Views/Floors/Floor" + floor + ".svg");

            //Read the file and display it line by line.
            System.IO.StreamReader file =
                new System.IO.StreamReader(path);
            while ((line = file.ReadLine()) != null)
            {
                Match match = rx.Match(line);
                if (match.Success)
                {
                    string clean = line.Replace("id=\"", "").Replace("\"", "").Trim();
                    ids = ids + " " + clean;
                    counter++;
                }
            }

            file.Close();
            return ids;
        }

        /// <summary>
        /// checks if user is logged in
        /// </summary>
        /// <returns>string containing if user is logged in</returns>
        [AllowAnonymous]
        [HttpGet]
        public ActionResult isAuth()
        {
            string returnString = null;

            if (Request.IsAuthenticated)
            {
                returnString = "True";
            }
            else
            {
                returnString = "False";
            }
            return Json(returnString, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// removes user from passed desk
        /// </summary>
        /// <param name="ID">desk id to be cleared</param>
        /// <returns>string upon completion or error</returns>
        [AllowAnonymous]
        [HttpGet]
        public ActionResult RemoveOccupant(string ID)
        {
            string returnString = null;
            try
            {

                returnString = "Completed";
            }
            catch
            {
                returnString = "DB error";
            }


            return Json(returnString, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// called on every location to determine if the location is occupied. if it is it
        /// changes the color of sent location
        /// </summary>
        /// <param name="id">Desk id given to check for occupancy</param>
        /// <returns>returns string to determine if javascript should change item color</returns>
        [AllowAnonymous]
        public ActionResult isOccupied(string id)
        {
            string returnString = "";
            try
            {

            }
            catch
            {
                returnString = "DB error";
            }

            return Json(returnString, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// if a user is logged in and they click an unoccupied desk they will be given the option to fill it
        /// they will then pass the user information and it will be added to the DB
        /// </summary>
        /// <param name="id">desk id</param>
        /// <param name="userId">employee id</param>
        /// <returns>returns completed upon successful addition to DB</returns>
        [AllowAnonymous]
        [HttpGet]
        public ActionResult deskFill(string id, string userId)
        {
            string returnString = "";
            try
            {
                returnString = "Completed";
            }
            catch
            {
                returnString = "DB error";
            }

            return Json(returnString, JsonRequestBehavior.AllowGet);
        }
    }
}