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
            
            CreateMap<Challenge, ChallengeDto>()
                .ForMember(dest => dest.OwnerId, opt => opt.MapFrom(src => src.UserId))
                .ForMember(dest => dest.OwnerName, opt => opt.MapFrom(src => src.User.FullName));
            CreateMap<Challenge, ChallengeDetailDto>()
                .ForMember(dest => dest.OwnerId, opt => opt.MapFrom(src => src.UserId))
                .ForMember(dest => dest.OwnerName, opt => opt.MapFrom(src => src.User.FullName));
            
            CreateMap<ChallengeDay, ChallengeDayDto>();
        }
    }
}
