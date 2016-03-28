﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WaxOnWaxOff.ViewModels
{
    public class LessonDTO
    {
        public LessonDTO()
        {
            this.Labs = new List<LabDTO>();
        }

        public int Id { get; set; }
        public string Title { get; set; }
        public ICollection<LabDTO> Labs { get; set; }
        public bool Passed { get; set; }
    }
}
