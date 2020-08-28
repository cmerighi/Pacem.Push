using AutoMapper;
using Pacem.Push;
using Pacem.Push.Entities;

namespace Microsoft.Extensions.DependencyInjection
{
    public static class MappingExtensions
    {
        public static void AddPacemWebPushMappings(this IMapperConfigurationExpression config)
        {
            config.CreateMap<VapidData, WebPush.VapidDetails>();

            config.CreateMap<Subscription, WebPush.PushSubscription>()
                .ForMember(p => p.P256DH, c => c.MapFrom(i => i.P256Dh))
                .ReverseMap()
                .ForMember(s => s.Expires, p => p.Ignore())
                .ForMember(s => s.Id, p => p.Ignore())
                .ForMember(s => s.UserId, p => p.Ignore())
                .ForMember(s => s.ClientId, p => p.Ignore())
                ;

            config.CreateMap<PushSubscription, Subscription>()
                .ForMember(s => s.Auth, c => c.MapFrom(i => i.Auth()))
                .ForMember(s => s.Expires, c => c.MapFrom(i => i.ExpirationTime))
                .ForMember(s => s.P256Dh, c => c.MapFrom(i => i.P256Dh()))
                .ForMember(s => s.UserId, c => c.MapFrom(i => i.UserId ?? Pacem.KeyGenerator.GetRandomString(16)))
                .ForMember(s => s.Id, c => c.Ignore())
                .ReverseMap()
                ;
        }
    }
}
