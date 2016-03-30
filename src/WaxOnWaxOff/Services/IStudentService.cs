using System.Collections.Generic;
using System.Threading.Tasks;
using WaxOnWaxOff.Models;

namespace WaxOnWaxOff.Services
{
    public interface IStudentService
    {
        Task<StudentViewModel> GetStudent(string id);
        IList<StudentViewModel> List();
    }
}