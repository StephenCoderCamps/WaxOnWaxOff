using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WaxOnWaxOff.ViewModels;

namespace WaxOnWaxOff.Models
{
    public class AutoMapperProfile : Profile
    {
        protected override void Configure()
        {
            CreateMap<Lesson, LessonDTO>()
                .ForMember(l => l.Labs, opt => opt.MapFrom(src => src.Labs.OrderBy(x => x.Title)));


            CreateMap<Lab, LabDTO>()
                .ForMember(m => m.ShowHTMLEditor, opt => opt.MapFrom(src => !String.IsNullOrWhiteSpace(src.HTMLSolution)))
                .ForMember(m => m.ShowJavaScriptEditor, opt => opt.MapFrom(src => !String.IsNullOrWhiteSpace(src.JavaScriptSolution)))
                .ForMember(m => m.ShowCSSEditor, opt => opt.MapFrom(src => !String.IsNullOrWhiteSpace(src.CSSSolution)))
                .ForMember(m => m.ShowTypeScriptEditor, opt => opt.MapFrom(src => !String.IsNullOrWhiteSpace(src.TypeScriptSolution)))
                .ForMember(m => m.ShowCSharpEditor, opt => opt.MapFrom(src => !String.IsNullOrWhiteSpace(src.CSharpSolution))
            );
        }

    
    }

}
