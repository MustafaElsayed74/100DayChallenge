using AutoMapper;
using Core.Entities;
using Service.DTOs;

namespace Service.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<RegisterDto, ApplicationUser>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Email));
            
            CreateMap<CreateChallengeDto, Challenge>();
            
            CreateMap<Challenge, ChallengeDto>();
            CreateMap<Challenge, ChallengeDetailDto>();
            
            CreateMap<ChallengeDay, ChallengeDayDto>();
        }
    }
}
